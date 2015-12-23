// Check https://github.com/gasolin/moonbar for more detail
// lets hack apps/search/js/providers/suggestions
var queryInstantSuggestions = function(term) {
  if (term) {
    //XXX mock for suggestion tags
    return [term, term + ' xxx', term + ' abc'];
  } else {
    return [];
  }
};

//element.innerHTML += '<span class="label label-primary">' + ele.name + '</span> ';
var createTag = function(parent, key, content, isVerb) {
  var ele = document.createElement('span');
  ele.classList.add('label');
  if(isVerb) {
    ele.classList.add('label-primary');
  }
  ele.classList.add('focusable');
  ele.dataset.key = key;
  ele.textContent = content;
  ele.addEventListener('click', tagHandler);
  parent.appendChild(ele);
};

var renderTags = function(element, verbs, results) {
  // render default labels
  if (!verbs || verbs.length == 0) {
    createTag(element, 'open', 'Open', true);

    verbSearch.providers.forEach(function(ele) {
      createTag(element, ele.name.toLowerCase(), ele.name, true);
    });
  } else {
    if (results.length != 0) {
      hasOpenTag = false;
      results.forEach(function(result) {
        var noun = reverseMap[result];
        if (noun.type == 'open' && !hasOpenTag) {
          createTag(element, 'open', 'Open', true);
          hasOpenTag = true;
        } else {
          createTag(element, noun.name.toLowerCase(), noun.name, true);
        }
      });
    } else {
      var suggestions = queryInstantSuggestions(verbs);
      // element.innerHTML += '<span id="a" class="label focusable">' + verbs + '</span> ';
      suggestions.forEach(function(result) {
        var span = document.createElement('span');
        span.classList.add('label');
        span.classList.add('focusable');
        span.dataset.type = 'search';
        span.id = verbSearch.providers[verbSearch.default].name.toLowerCase();
        span.dataset.key = result;
        span.textContent = result;
        span.addEventListener('click', tagHandler);
        element.appendChild(span);
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
    var restTerm = input.trimRight().slice(verb.length);
    var results = pedia.filter(function(element) {
      return element.indexOf(verb) > -1;
    });
    return [verb, restTerm, results];
  }
};

var executeCommand = function(target) {
  var type = target.dataset.type;
  var id = target.id;

  switch (type) {
    case 'open':
      var url = actionMap[type][
        reverseMap[id].idx
      ].url;
      //console.log('open '+ url);
      window.open(url, '_blank');
      break;
    default:
      var url = actionMap['search'][
        reverseMap[id].idx
      ].url;
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
      executeCommand(evt.target);
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
  executeCommand(target);
};

var resetUI = function() {
  suggestionsSelect.innerHTML = '';
  suggestionTags.innerHTML = '';
  if (!tip.classList.contains('hidden')) {
    tip.classList.add('hidden');
  }
};

var renderSuggestions = function(element, verb, restTerm, results) {
  // show default verb tags
  if (searchfield.value.length == 0) {
    return;
  }
  if (results.length != 0) {
    // render suggestions
    results.forEach(function(result) {
      var noun = reverseMap[result];
      var li = document.createElement('li');
      li.id = result;
      li.dataset.type = noun.type;
      li.classList.add('focusable');
      switch (noun.type) {
        case 'open':
          //suggestionsSelect.innerHTML += '<li>Open ' + noun.name + '</li>';
          li.textContent = 'Open ' + noun.name;
          li.addEventListener('click', clickHandler);
          element.appendChild(li);
          break;
        default: //'search'
          //suggestionsSelect.innerHTML += '<li>Search ' + restTerm + ' with ' + noun.name + '</li>';
          // TOOD: excape the term
          li.dataset.key = encodeURI(restTerm);
          li.textContent = 'Search ' + restTerm + ' with ' + noun.name;
          li.addEventListener('click', clickHandler);
          element.appendChild(li);
          break;
      }
    });
  } else { // search through default search provider
    //suggestionsSelect.innerHTML = '<li>' + 'Search ' + searchfield.value + '</li>';
    var restTerm = searchfield.value;
    var li = document.createElement('li');
    li.id = verbSearch.providers[verbSearch.default].name.toLowerCase();
    li.dataset.type = 'search';
    li.classList.add('focusable');
    li.dataset.key = encodeURI(restTerm);
    li.textContent = 'Search ' + restTerm;
    li.addEventListener('click', clickHandler);
    element.appendChild(li);
  }
};

var processInputs = function() {
  var [verb, restTerm, results] = huxian.parse(searchfield.value, searchPool);
  resetUI();
  renderTags(suggestionTags, verb, results);
  renderSuggestions(suggestionsSelect, verb, restTerm, results);
  // make everything navigatable
  $('.focusable').SpatialNavigation();
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
