// Check https://github.com/gasolin/moonbar for more detail
// lets hack apps/search/js/providers/suggestions
var _getProvider = function(type, id) {
  return actionMap[type][
    reverseMap[id].idx
  ];
};

var queryInstantSuggestions = function(verb, restTerm) {
  return new Promise(function(resolve) {
    if (restTerm) {
      //XXX mock for non default suggestion tags
      return resolve([restTerm, restTerm + ' xxx', restTerm + ' abc']);
    } else {
      if(verb.length < 3) {
        resolve([]);
      }

      var defaultProvider = verbSearch.providers[verbSearch.default].name.toLowerCase();
      var suggestUrl = _getProvider('search', defaultProvider).suggest;
      // console.log(suggestUrl + encodeURI(verb));
      $.ajax({
        type: "GET",
        url: suggestUrl + encodeURIComponent(verb),
        dataType:"jsonp"
      }).done(function(response) {
        //console.log(JSON.stringify(response));
        return resolve(response[1]);
      });
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

var renderTags = function(element, verbs, results, inputText) {
  // render default labels
  if (!verbs || verbs.length == 0) {
    _createTag(element, 'open', 'Open', true);

    verbSearch.providers.forEach(function(ele) {
      _createTag(element, ele.name.toLowerCase(), ele.name, true);
    });
  } else {
    if (results.length != 0) {
      hasOpenTag = false;
      results.forEach(function(result) {
        var noun = reverseMap[result];
        if (noun.type == 'open' && !hasOpenTag) {
          _createTag(element, 'open', 'Open', true);
          hasOpenTag = true;
        } else {
          _createTag(element, noun.name.toLowerCase(), noun.name, true);
        }
      });
    } else {
      queryInstantSuggestions(inputText).then(function(suggestions) {
        suggestions.forEach(function(result) {
          _createTag(element, result, result, false, 'search');
        });
        // keyboard navigatable
        $('.focusable').SpatialNavigation();
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

var _executeCommand = function(target) {
  var type = target.dataset.type;
  var id = target.id;

  switch (type) {
    case 'open':
      var url = _getProvider(type, id).url;
      //console.log('open '+ url);
      window.open(url, '_blank');
      break;
    default:
      var url = _getProvider(type, id).url;
      //console.log('open ' + url + evt.target.dataset.key);
      window.open(url + target.dataset.key, '_blank');
      break;
  }
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
      var verbs = evt.target.dataset.key;
      switch(verbs) {
        case 'open':
          searchfield.focus();
          tip.textContent = "tap the open label show app list";
          break;
        default:
          searchfield.value = verbs + ' ';
          processInputs();
          searchfield.focus();
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
  renderTags(suggestionTags, verb, results, searchfield.value);
  renderSuggestions(suggestionsSelect, verb, restTerm, results, searchfield.value);
};

// init start
// define all supported verbs
var verbAddons = [verbSearch, verbOpen];

// the universal verb tags pool
var searchPool = [];
// the referece map to the origin provider object
var reverseMap = {};
// map the verb with its action providers
var actionMap = {};

// TODO: could do in worker
// Initialize action verbs mapping
verbAddons.forEach(function(verb) {
  actionMap[verb.actionVerb] = verb.providers;

  verb.providers.forEach(function(ele, idx) {
    searchPool.push(ele.name.toLowerCase());
    reverseMap[ele.name.toLowerCase()] = {
      'name': ele.name,
      'type': verb.actionVerb,
      'idx': idx
    };
  });
});

$.material.ripples();
// init end
