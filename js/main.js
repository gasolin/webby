'use strict';
// Check https://github.com/gasolin/moonbar for more detail
// lets hack apps/search/js/providers/suggestions
var _getProvider = function(type, id) {
  return actionMap[type][
    reverseMap[id].idx
  ];
};

var queryInstantSuggestions = function(verb, restTerm, results) {
  return new Promise(function(resolve) {
    if (restTerm) {
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
            type: "GET",
            url: suggestUrl + encodeURIComponent(restTerm),
            dataType:"jsonp"
          }).done(function(response) {
            //console.log(JSON.stringify(response));
            return resolve(response[1]);
          });
        } else {
          console.log('no matched search suggestion provider');
        }
      }
    } else {
      if(verb.length < 3) {
        return resolve([]);
      }

      var defaultProvider = verbSearch.providers[verbSearch.default].name.toLowerCase();
      var provider = _getProvider('search', defaultProvider);
      if (provider) {
        var suggestUrl = provider.suggest;
        // console.log(suggestUrl + encodeURI(verb));
        $.ajax({
          type: "GET",
          url: suggestUrl + encodeURIComponent(verb),
          dataType:"jsonp"
        }).done(function(response) {
          //console.log(JSON.stringify(response));
          return resolve(response[1]);
        });
      } else {
        console.log('no matched search suggestion provider');
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
        ele.id = verbSearch.providers[verbSearch.default].name.toLowerCase();
        break;
    }
  }
  ele.addEventListener('click', tagHandler);
  parent.appendChild(ele);
};

/**
 * Render verb tags and suggestion tags
 */
var renderTags = function(element, verbs, restTerm, results, inputText) {
  // render default labels
  if (!verbs || verbs.length == 0) {
    verbAddons.forEach(function(verbAddon) {
      if (verbAddon.flattern) { // turn each provider as a tag
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
        if (noun.flattern) {
          _createTag(element, noun.name.toLowerCase(), noun.name, true);
        } else if (!hasTag[noun.type]) {
          _createTag(element, noun.type, noun.type, true);
          hasTag[noun.type] = true;
        }
      });

      queryInstantSuggestions(verbs, restTerm, results).then(function(suggestions) {
        if (suggestions) {
          suggestions.forEach(function(result) {
            _createTag(element, result, result, false, 'search');
          });
          // keyboard navigatable
          $('.focusable').SpatialNavigation();
        }
      });
    } else {
      queryInstantSuggestions(inputText).then(function(suggestions) {
        if (suggestions) {
          suggestions.forEach(function(result) {
            _createTag(element, result, result, false, 'search');
          });
          // keyboard navigatable
          $('.focusable').SpatialNavigation();
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
    }
  });
};

var huxian = {
  parse: function p_parse(input, pedia) {
    var keys = input.trimRight().split(' ');
    var verb = keys[0].toLowerCase();
    // cut out verb with a space
    var restTerm = input.trimRight().slice(verb.length + 1);
    var results = pedia.filter(function(element) {
      return element.indexOf(verb) > -1;
    });
    return [verb, restTerm, results];
  }
};

var _renderChatBox = function(speaker, msg) {
  var chatbox = document.createElement('section');
  chatbox.classList.add('chat', speaker + '-chat');
  //chatbox.textContent = "I am " + target.dataset.type + "ing \"" + decodeURI(target.dataset.key) + "\" with " + target.id; 
  chatbox.innerHTML = msg;
  chatHistory.appendChild(chatbox);
}

var userSpeakCommand = function(msg) {
  _renderChatBox('user', msg);
}

var botSpeakCommandResult = function(target, resultUrl) { //resultUrl is for the default case
  var type = target.dataset.type;
  var id = target.id;
  var url = _getProvider(type, id).url;

  var msg = "I am " + target.dataset.type + "ing \"" + decodeURI(target.dataset.key) + "\" with " + target.id + "...<br/>"; 
  msg += "Here you are: <a href=\"" + resultUrl + "\">" + decodeURI(target.dataset.key) + " on " + target.id + "</a>"; 
  _renderChatBox('bot', msg);
}

var _executeCommand = function(target) {
  var type = target.dataset.type;
  var id = target.id;
  console.log(target)

  switch (type) {
    case 'open':
      var url = _getProvider(type, id).url;
      //console.log('open '+ url);
      var msg = "Open \"" + decodeURI(target.id) + "\"";
      var response = "Here you are: <a href=\"" + url + "\" target=\"_blank\">" + decodeURI(target.id) + "</a>"; 

      _renderChatBox('user', msg);
      _renderChatBox('bot', response);
      window.open(url, '_blank');
      break;
    case 'config':
      var url = _getProvider(type, id).url;
      var msg = "Open configuration \"" + decodeURI(target.id) + "\"";
      var response = "Here you are: <a href=\"" + url + "\" target=\"_blank\">" + decodeURI(target.id) + "</a>"; 
      _renderChatBox('user', msg);
      _renderChatBox('bot', response);

      window.open(url, '_blank');
      break;
    default:
      var url = _getProvider(type, id).url;
      //console.log('open ' + url + evt.target.dataset.key);
      var msg = target.dataset.type + " \"" + decodeURI(target.dataset.key) + "\" with " + target.id; 
      var response = "I am " + target.dataset.type + "ing \"" + decodeURI(target.dataset.key) + "\" with " + target.id + "...<br/>"; 
      response += "Here you are: <a href=\"" + url + target.dataset.key + "\" target=\"_blank\">" + decodeURI(target.dataset.key) + " on " + target.id + "</a>"; 

      _renderChatBox('user', msg);
      _renderChatBox('bot', response);
      window.open(url + target.dataset.key, '_blank'); 
      break;
  }
};

var _renderProviders = function(verb) {
  verbAddons.forEach(function(verbAddon) {
    if (verbAddon.actionVerb === verb) {
      verbAddon.providers.forEach(function(provider) {
        //XXX should not bound with specific element
        _createSuggestion(
          suggestionsSelect,
          provider.name.toLowerCase(),
          verb,
          verb + ' ' + provider.name);
      });
    }
  });
};

var tagHandler = function(evt) {
  if (tip.classList.contains('hidden')) {
    tip.classList.remove('hidden');
  }
  if(evt.target) {
    var type = evt.target.dataset.type;
    if (type) {
      _executeCommand(evt.target);
    } else {
      var verb = evt.target.dataset.key;
      searchfield.value = verb + ' ';
      processInputs();
      searchfield.focus();
      switch(verb) {
        case 'open':
          _renderProviders(verb);
          break;
        case 'config':
          _renderProviders(verb);
          tip.textContent = "tap the config label will show config list";
          break;
        default:
          tip.textContent = "tap the label should help you further scoping the suggestions around " + evt.target.textContent;
          break;
      }
    }
  }
};

var clickHandler = function(evt) {
  if (tip.classList.contains('hidden')) {
    tip.classList.remove('hidden');
  }
  var target = evt.target;
  tip.textContent = "tap the row should " + target.dataset.type + ' ' + target.id;
  _executeCommand(target);
};

var resetUI = function() {
  suggestionsSelect.innerHTML = '';
  suggestionTags.innerHTML = '';
  if (!tip.classList.contains('hidden')) {
    tip.classList.add('hidden');
  }
};

var _createSuggestion = function(parent, id, actionType, content, key) {
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

var renderSuggestions = function(element, verb, restTerm, results, inputText) {
  // show default verb tags
  if (searchfield.value.length == 0) {
    // make everything navigatable
    $('.focusable').SpatialNavigation();
    return;
  }
  if (results.length != 0) {
    // render suggestions
    results.forEach(function(result) {
      var noun = reverseMap[result];
      switch (noun.type) {
        case 'open':
          //suggestionsSelect.innerHTML += '<li>Open ' + noun.name + '</li>';
          _createSuggestion(
            element,
            result,
            noun.type,
            'Open ' + noun.name);
          break;
        case 'config':
          _createSuggestion(
            element,
            result,
            noun.type,
            'config ' + noun.name);
            break;
        default: //'search'
          //suggestionsSelect.innerHTML += '<li>Search ' + restTerm + ' with ' + noun.name + '</li>';
          _createSuggestion(
            element,
            result, noun.type,
            'Search ' + restTerm + ' with ' + noun.name,
            restTerm);
          break;
      }
    });
  } else { // search through default search provider
    //suggestionsSelect.innerHTML = '<li>' + 'Search ' + searchfield.value + '</li>';
    var restTerm = inputText;
    _createSuggestion(
      element,
      verbSearch.providers[verbSearch.default].name.toLowerCase(),
      'search',
      'Search ' + restTerm,
      restTerm);
  }
  // make everything navigatable
  $('.focusable').SpatialNavigation();
};

var processInputs = function() {
  var [verb, restTerm, results] = huxian.parse(searchfield.value, searchPool);
  resetUI();
  renderTags(suggestionTags, verb, restTerm, results, searchfield.value);
  renderSuggestions(suggestionsSelect, verb, restTerm, results, searchfield.value);
};

// init start
// define all supported verbs
var verbAddons = [verbSearch, verbOpen, verbConfig];

// the universal verb tags pool
var searchPool = [];
// the referece map to the origin provider object
var reverseMap = {};
// map the verb with its action providers
var actionMap = {};

// TODO: could do in worker
// Initialize action verbs mapping
verbAddons.forEach(function(verbAddon) {
  actionMap[verbAddon.actionVerb] = verbAddon.providers;

  verbAddon.providers.forEach(function(ele, idx) {
    searchPool.push(ele.name.toLowerCase());
    reverseMap[ele.name.toLowerCase()] = {
      'name': ele.name,
      'type': verbAddon.actionVerb,
      'idx': idx,
      'flattern': verbAddon.flattern
    };
  });
});

$.material.ripples();
// init end
