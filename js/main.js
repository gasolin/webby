/*globals $, defaultVerbStore, defaultAdjStore, defaultNounStore,
          verbSearch, localforage, UrlHelper, DialogManager */
'use strict';

/**
 * Object to store parsing result.
 *
 * {string[]} verbs verb list
 * {string} restTerm input field exclude the verb
 * {string[]} results parse results
 */
var parseResult = {
  verb: '',
  restTerm: '',
  results: []
};

var template = function(templateBody, data) {
  return templateBody.replace(/{(\w*)}/g,
    function(textMatched, key) {
      return data.hasOwnProperty(key) ? data[key] : '';
    });
};

/**
 * input text parser, respond for everything
 */
var huxian = {
  parse: function(input, pedia) {
    var keys = input.trimRight().split(' ');
    var verb = keys[0].toLowerCase();
    // cut out verb with a space
    var restTerm = input.trimRight().slice(verb.length + 1);
    var results = pedia.filter(function(element) {
      return element.indexOf(verb) > -1;
    });
    if(restTerm && results[0]) {
      results = [results[0]];
    }

    // console.log('huxian: ', verb, restTerm, results);
    parseResult.verb = verb;
    parseResult.restTerm = restTerm;
    parseResult.results = results;
    return parseResult;
  }
};

/**
 * helper function to get data from providers
 *
 * @param {string} type main verb type
 * @param {string} id content id that stored in the reverseMap
 * @returns {object} verb provider object
 */
var _getProvider = function(type, id) {
  return actionMap[type][
    reverseMap[id].idx
  ];
};

/**
 * query online provider to get instant results
 *
 * @param {string} inputText origin input text
 * @returns {promise} search result
 */
var queryInstantSuggestions = function(inputText) {
  var verb = inputText ? inputText : parseResult.verb;
  var restTerm = parseResult.restTerm;
  var results = parseResult.results;

  return new Promise(function(resolve) {
    if (inputText) {
      if(verb.length < 3) {
        return resolve([]);
      }

      var defaultProvider = verbSearch.providers[verbSearch.default]
        .name.toLowerCase();
      var provider = _getProvider('search', defaultProvider);
      if (provider) {
        var suggestUrl = provider.suggest;
        // console.log(suggestUrl + encodeURI(verb));
        $.ajax({
          type: 'GET',
          url: template(suggestUrl, {
            searchTerms: encodeURIComponent(verb)
          }),
          dataType: 'jsonp'
        }).done(function(response) {
          //console.log(JSON.stringify(response));
          return resolve(response[1]);
        });
      } else {
        console.log('no matched search suggestion provider');
      }
    } else {
      if (typeof results === 'object' && results.length > 0) {
        verb = results[0];
        if (restTerm.length < 3) {
          return resolve([]);
        }

        var provider = _getProvider('search', verb);
        if (provider) {
          var suggestUrl = provider.suggest;
          // console.log(suggestUrl + encodeURI(verb));
          $.ajax({
            type: 'GET',
            url: template(suggestUrl, {
              searchTerms: encodeURIComponent(restTerm)
            }),
            dataType: 'jsonp'
          }).done(function(response) {
            //console.log(JSON.stringify(response));
            return resolve(response[1]);
          });
        } else {
          console.log('no matched search suggestion provider');
        }
      }
    }
  });
};

var _createTag = function(parent, key, content, isVerb, actionType) {
  var ele = document.createElement('span');
  ele.classList.add('label');
  ele.classList.add('focusable');
  ele.dataset.key = key;
  ele.textContent = content;
  if(isVerb) { // action verb
    //element.innerHTML += '<span class="label label-primary">' + ele.name + '</span> ';
    ele.classList.add('label-primary');
  } else { // instant suggestion
    // element.innerHTML += '<span id="a" class="label focusable">' + verbs + '</span> ';
    ele.dataset.type = actionType;
    switch(actionType) {
    case 'search':
      var searchProvider = parseResult.results[0];
      if (searchProvider) {
        ele.id = searchProvider.toLowerCase();
      } else {
        ele.id = verbSearch.providers[verbSearch.default].name.toLowerCase();
      }
      break;
    default:
      break;
    }
  }
  ele.addEventListener('click', tagHandler);
  parent.appendChild(ele);
};

// make everything keyboard navigatable
var recalcSpatialNavigation = function() {
  $('.focusable').SpatialNavigation();
};

/**
 * Render verb tags and suggestion tags.
 *
 * @param {HTMLElement} element dom element
 * @param {string} inputText origin input text
 */
var renderTags = function(element, inputText) {
  // render default labels
  var verb = parseResult.verb;
  var restTerm = parseResult.restTerm;
  var results = parseResult.results;
  if (!verb || verb.length == 0) { //default
    verbAddons.forEach(function(verbAddon) {
      // turn each provider as a tag
      if (verbAddon.indexing === 'provider') {
        verbAddon.providers.forEach(function(ele) {
          _createTag(element, ele.name.toLowerCase(), ele.name, true);
        });
      } else {
        _createTag(element, verbAddon.actionVerb, verbAddon.actionVerb, true);
      }
    });
  } else {
    if (results.length != 0) {
      var hasTag = {};
      results.forEach(function(result) {
        var noun = reverseMap[result];
        if (noun.indexing === 'both' || noun.indexing === 'provider') {
          _createTag(element, noun.name.toLowerCase(), noun.name, true);
        } else if (!hasTag[noun.type]) {
          _createTag(element, noun.type, noun.type, true);
          hasTag[noun.type] = true;
        }
      });

      queryInstantSuggestions().then(function(suggestions) {
        if (suggestions) {
          suggestions.forEach(function(result) {
            _createTag(element, result, result, false, 'search');
          });

          recalcSpatialNavigation();
        }
      });
    } else {
      queryInstantSuggestions(inputText).then(function(suggestions) {
        if (suggestions) {
          suggestions.forEach(function(result) {
            _createTag(element, result, result, false, 'search');
          });

          recalcSpatialNavigation();
        }
      });
    }
  }
};

var registerKeyboardHandlers = function() {
  // when press enter key, run the first suggestion
  searchfield.addEventListener('keydown', function(evt) {
    switch (evt.keyCode) {
    case 13: //enter
      if (suggestionsSelect.hasChildNodes()) {
        clickHandler({
          target: suggestionsSelect.childNodes[0]
        });
      }
      break;
    // Navigation hacks
    case 40: //down
      if(suggestionsSelect.hasChildNodes()) {
        //console.log('has tags' + suggestionsSelect.childNodes[0].id);
        suggestionsSelect.childNodes[0].focus();
      }
      break;
    default:
      break;
    }
  });

  // Navigation hacks
  suggestionTags.addEventListener('keydown', function(evt) {
    switch (evt.keyCode) {
    case 13: //enter
      tagHandler({
        target: evt.target
      });
      break;
    case 38: //up
      console.log('focus to input field');
      searchfield.focus();
      break;
    default:
      break;
    }
  });

  // Navigation hacks
  suggestionsSelect.addEventListener('keydown', function(evt) {
    switch (evt.keyCode) {
    case 13: //enter
      clickHandler({
        target: evt.target
      });
      break;
    default:
      break;
    }
  });
};

var verbOpenHandler = {
  runCommand: function(target) {
    var type = target.dataset.type;
    var id = target.id;
    var url = _getProvider(type, id).url;
    var isEmbed = false;
    var isIFTTT = false;
    var providerType = _getProvider(type, id).type;
    if (providerType) {
      switch(providerType) {
      case 'widget':
        isEmbed = true;
        break;
      case 'ifttt':
        isIFTTT = true;
        break;
      default:
        break;
      }
    }

    /* TODO: remove in 0.7 */
    if (_getProvider(type, id).embed) {
      isEmbed = true;
    }
    //console.log('open '+ url);

    DialogManager.push({
      speaker: 'user',
      msg: template(adjPersona.actionOpen, {
        provider: decodeURI(id)
      })
    });

    var responseMsg = '';
    if (isEmbed) {
      responseMsg = template(adjPersona.showWidget, {url: url});
      DialogManager.push({
        speaker: 'bot',
        msg: responseMsg
      });

      searchfield.value = '';
      processInputs();
    } else if (isIFTTT) { //test with ifttt maker channel
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        // data: 'restTerm',
      }).done(function(data) { //called when successful
        console.log(data);
        responseMsg = template(adjPersona.showWebhook, {
          url: url,
          name: _getProvider(type, id).name
        });
        DialogManager.push({
          speaker: 'bot',
          msg: responseMsg
        });
      }).fail(function(e) {
        console.log('fail:' + JSON.stringify(e));
        if (e.readyState === 4) {
          responseMsg = template(adjPersona.showWebhook, {
            url: url,
            name: _getProvider(type, id).name
          });
        } else {
          //called when there is an error
          //console.log(e.message);
          responseMsg = template(adjPersona.showWebhookFailed, {
            name: _getProvider(type, id).name,
            msg: e.message
          });
        }

        DialogManager.push({
          speaker: 'bot',
          msg: responseMsg
        });
      });

      searchfield.value = '';
      processInputs();
    } else {
      responseMsg = template(adjPersona.showLink, {
        url: url, provider: decodeURI(id)
      });
      DialogManager.push({
        speaker: 'bot',
        msg: responseMsg
      });

      openLink(url);
    }
  },

  //suggestionsSelect.innerHTML += '<li>Open ' + provider.name + '</li>';
  createSuggestion: function(element, result, provider) {
    if (result === 'open') {
      _renderProviders(suggestionsSelect, 'open');
    } else {
      _createSuggestion(
        element,
        result,
        provider.type,
        'Open ' + provider.name);
    }
  }
};

var verbConfigHandler = {
  runCommand: function(target) {
    var type = target.dataset.type;
    var id = target.id;
    var url = _getProvider(type, id).url;
    var isEmbed = false;
    var isHTTPGet = false;
    var providerType = _getProvider(type, id).type;
    if (providerType) {
      switch(providerType) {
      case 'widget':
        isEmbed = true;
        break;
      case 'httpget':
        isHTTPGet = true;
      default:
        break;
      }
    }

    /* TODO: remove in 0.7 */
    if (_getProvider(type, id).embed) {
      isEmbed = true;
    }

    DialogManager.push({
      speaker: 'user',
      msg: template(adjPersona.actionConfig, {
        provider: decodeURI(id)
      })
    });

    var response = '';
    if (isEmbed) {
      response = template(adjPersona.showWidget, {url: url});
    } else {
      response = template(adjPersona.showLink,
        {url: url, provider: decodeURI(id)});
    }

    DialogManager.push({
      speaker: 'bot',
      msg: response
    });

    if (isEmbed) {
      searchfield.value = '';
      processInputs();
    } else {
      openLink(url);
    }
  },

  createSuggestion: function(element, result, provider) {
    if (result === 'config') {
      _renderProviders(suggestionsSelect, 'config');
    } else {
      _createSuggestion(
        element,
        result,
        provider.type,
        'Config ' + provider.name);
    }
  }
};

var _showTip = function(msg) {
  if (tip.classList.contains('hidden')) {
    tip.classList.remove('hidden');
  }
  tip.textContent = msg;
};

var verbSearchHandler = {
  runCommand: function(target) {
    var type = target.dataset.type;
    var id = target.id;
    var input = target.dataset.key;
    // console.log(type, id, input);
    // Not a valid URL, could be a search term
    if (!input) {
      _showTip('please type more charactor to get result');
    } else if (UrlHelper.isNotURL(input)) {
      var url = template(_getProvider(type, id).url, {
        searchTerms: input
      });
      //console.log('open ' + url + evt.target.dataset.key);
      DialogManager.push({
        speaker: 'user',
        msg: template(adjPersona.actionSearch, {
          verb: type,
          searchTerms: decodeURI(input),
          provider: id
        })
      });
      DialogManager.push({
        speaker: 'bot',
        msg: template(adjPersona.actionSearchReply, {
          url: url,
          verb: type,
          searchTerms: decodeURI(input),
          provider: id})
      });
      openLink(template(url, {
        searchTerms: input
      }));
    } else { // open page directly
      // console.log('ori:' + input);
      input = input.replace('%3A%2F%2F', '://');
      var hasScheme = UrlHelper.hasScheme(input);
      // No scheme, prepend basic protocol and return
      if (!hasScheme) {
        input = 'http://' + input;
      }
      // console.log(input);
      openLink(input);
    }
  },

  //suggestionsSelect.innerHTML += '<li>Search ' + restTerm +
  //  ' with ' + provider.name + '</li>';
  createSuggestion: function(element, result, provider, restTerm) {
    _createSuggestion(
      element,
      result,
      provider.type,
      'Search ' + restTerm + ' with ' + provider.name,
      restTerm);
  }
};

var _runCommand = function(target) {
  //console.log(target);
  switch (target.dataset.type) {
  case 'open':
    verbOpenHandler.runCommand(target);
    break;
  case 'config':
    verbConfigHandler.runCommand(target);
    break;
  default: // search
    verbSearchHandler.runCommand(target);
    break;
  }
};

var _renderProviders = function(element, verb) {
  verbAddons.forEach(function(verbAddon) {
    if (verbAddon.actionVerb === verb) {
      verbAddon.providers.forEach(function(revProvider) {
        _createSuggestion(
          element,
          revProvider.name.toLowerCase(),
          verb,
          verb + ' ' + revProvider.name);
      });
    }
  });
};

var tagHandler = function(evt) {
  var target = evt.target;
  if(target) {
    // provider flatten
    var type = target.dataset.type;
    if (type) {
      _runCommand(target);
    } else {
      var verb = target.dataset.key;
      searchfield.value = verb + ' ';
      processInputs();
      searchfield.focus();
      switch(verb) {
      case 'open':
        _renderProviders(suggestionsSelect, verb);
        break;
      case 'config':
        _renderProviders(suggestionsSelect, verb);
        // tip.textContent = 'tap the config label will show config list';
        break;
      default:
        _showTip('tap the label should help you further scoping the ' +
          'suggestions around ' + target.textContent);
        break;
      }
    }
  }
};

var clickHandler = function(evt) {
  // var target = evt.target;
  // _showTip('tap the row should ' + target.dataset.type + ' ' +
  //   target.id);
  _runCommand(evt.target);
};

var resetUI = function() {
  suggestionsSelect.innerHTML = '';
  suggestionTags.innerHTML = '';
  if (!tip.classList.contains('hidden')) {
    tip.classList.add('hidden');
  }
};

var _createSuggestion = function(parent, id, actionType, content, key) {
  // console.log(id, actionType);
  var ele = document.createElement('li');
  ele.id = id;
  ele.dataset.type = actionType;
  ele.classList.add('focusable');
  ele.textContent = content;
  if(key) {
    ele.dataset.key = encodeURIComponent(key);
  }
  ele.addEventListener('click', clickHandler);
  parent.appendChild(ele);
};

/**
 * render suggestion list
 *
 * @param {HTMLElement} element dom element
 * @param {string} inputText origin input text
 */
var renderSuggestions = function(element, inputText) {
  var verb = parseResult.verb;
  var restTerm = parseResult.restTerm;
  var results = parseResult.results;
  // show default verb tags
  if (searchfield.value.length === 0) {
    recalcSpatialNavigation();
    return;
  }
  if (results.length != 0) {
    // render suggestions
    results.forEach(function(result) {
      var revProvider = reverseMap[result];
      switch (revProvider.type) {
      case 'open':
        verbOpenHandler.createSuggestion(element, result, revProvider);
        break;
      case 'config':
        verbConfigHandler.createSuggestion(element, result, revProvider);
        break;
      default: // search
        verbSearchHandler.createSuggestion(
          element, result, revProvider, restTerm);
        // console.log('search through default provider');
        break;
      }
    });
  } else { // search through default search provider
    //suggestionsSelect.innerHTML = '<li>' + 'Search ' + searchfield.value + '</li>';
    var defaultSearchProvider =
      verbSearch.providers[verbSearch.default].name.toLowerCase();
    verbSearchHandler.createSuggestion(
      element,
      defaultSearchProvider,
      reverseMap[defaultSearchProvider],
      inputText);
  }
  recalcSpatialNavigation();
};

var openLink = function(url) {
  window.location = url;
};

var processInputs = function() {
  huxian.parse(searchfield.value, searchPool);
  resetUI();
  renderTags(suggestionTags, searchfield.value);
  renderSuggestions(suggestionsSelect, searchfield.value);
};

// init start
var verbStoreKey = 'verbstore';
var adjPersona;
var nounPreference;
var verbAddons = [];
// the universal verb tags pool
var searchPool = [];
// the referece map to the origin provider object
var reverseMap = {};
// map the verb with its action providers
var actionMap = {};

// Initialize action verbs mapping
var initVerbsMapping = function() {
  verbAddons.forEach(function(verbAddon) {
    actionMap[verbAddon.actionVerb] = verbAddon.providers;
    if (verbAddon.indexing === 'both' || verbAddon.indexing === 'verb') {
      searchPool.push(verbAddon.actionVerb.toLowerCase());
      reverseMap[verbAddon.actionVerb.toLowerCase()] = {
        'name': verbAddon.actionVerb,
        'type': verbAddon.actionVerb,
        'idx': -1,
        'indexing': verbAddon.indexing
      };
    }

    verbAddon.providers.forEach(function(ele, idx) {
      searchPool.push(ele.name.toLowerCase());
      reverseMap[ele.name.toLowerCase()] = {
        'name': ele.name,
        'type': verbAddon.actionVerb,
        'idx': idx,
        'indexing': verbAddon.indexing
      };
    });
    // console.log(searchPool);
  });
};

var titlebar = document.getElementById('titlebar');
var searchfield = document.getElementById('search');
var suggestionsSelect = document.getElementById('suggestions-select');
var suggestionTags = document.getElementById('suggestion-tags');
var tip = document.getElementById('tip');
var chatHistory = document.getElementById('chat-history');

var initUI = function() {
  document.body.classList.remove('hidden');

  renderTags(suggestionTags);
  searchfield.addEventListener('input', processInputs);
  searchfield.focus();

  // click to reset input fields
  titlebar.addEventListener('click', function() {
    searchfield.value = '';
    processInputs();
  });
  registerKeyboardHandlers();

  $.material.ripples();
};

var init = function() {
  initVerbsMapping();
  initUI();
  DialogManager.init(chatHistory, adjPersona);
};

// get cached verbs or fallback to default verbs
var buildVerbs = function(cachedVerbs) {
  return new Promise(function(resolve) {
    if (!cachedVerbs) { // define all supported verbs
      verbAddons = defaultVerbStore;
      localforage.setItem(verbStoreKey,
        JSON.stringify(defaultVerbStore)).then(resolve);
    } else {
      verbAddons = cachedVerbs;
      resolve();
    }
  });
};

// default personality
// TODO: load personality locally
adjPersona = defaultAdjStore;
// default preference
// TODO: load preference locally
nounPreference = defaultNounStore;
// load addon locally
localforage.getItem(verbStoreKey, function(err, value) {
  if (err) {
    console.error(err);
  } else {
    buildVerbs(JSON.parse(value)).then(function() {
      init();
    }).catch(function(err) {
      console.log('Migration failed');
      throw err;
    });
  }
});
// init end
