//document.body.classList.remove('hidden');
$.material.ripples();

// Check https://github.com/gasolin/moonbar for more detail
// lets hack apps/search/js/providers/suggestions
var verbSearch = {
  actionVerb: 'search',
  providers: [{
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    suggest: 'https://www.google.com/complete/search?client=firefox&q='
  }, {
    name: 'Yahoo',
    url: 'https://search.yahoo.com/search?p=',
    suggest: 'https://search.yahoo.com/sugg/ff?output=fxjson&command='
  }, {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    suggest: 'https://www.bing.com/osjson.aspx?query='
  }, {
    name: 'Wikipedia',
    url: 'https://en.wikipedia.org/w/index.php?search=',
    suggest: 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles='
  }, {
    name: 'GitHub',
    url: 'https://github.com/search?utf8=✓&q=',
    suggest: ''
  }],
  default: 0
};

var verbOpen = {
  actionVerb: 'open',
  providers: [{
    name: 'Facebook',
    url: 'http://www.facebook.com/'
  }, {
    name: 'Twitter',
    url: 'http://www.twitter.com/'
  }, {
    name: 'Calendar',
    url: 'http://calendar.google.com/'
  }, {
    name: 'Email',
    url: 'http://www.gmail.com/'
  }, {
    name: 'Gallery',
    url: 'http://www.flickr.com/'
  }, {
    name: 'Music',
    url: 'http://douban.fm/'
  }],
  default: 0
};

var renderTags = function(element, verbs, results) {
  // render default labels
  if (!verbs || verbs.length == 0) {
    var span = document.createElement('span');
    span.classList.add('label');
    span.classList.add('label-primary');
    span.classList.add('focusable');
    span.dataset.key = 'open';
    span.textContent = 'Open';
    span.addEventListener('click', tagHandler);
    element.appendChild(span);

    verbSearch.providers.forEach(function(ele) {
      //element.innerHTML += '<span class="label label-primary">' + ele.name + '</span> ';
      var span = document.createElement('span');
      span.classList.add('label');
      span.classList.add('label-primary');
      span.classList.add('focusable');
      span.dataset.key = ele.name.toLowerCase();
      span.textContent = ele.name;
      span.addEventListener('click', tagHandler);
      element.appendChild(span);
    });
  } else {
    if (results.length != 0) {
      hasOpenTag = false;
      results.forEach(function(result) {
        var noun = reverseMap[result];
        if (noun.type == 'open' && !hasOpenTag) {
          //element.innerHTML += '<span class="label label-primary">Open</span> ';
          var span = document.createElement('span');
          span.classList.add('label');
          span.classList.add('label-primary');
          span.classList.add('focusable');
          span.dataset.key = 'open';
          span.textContent = 'Open';
          span.addEventListener('click', tagHandler);
          element.appendChild(span);
          hasOpenTag = true;
        } else {
          //element.innerHTML += '<span class="label label-primary">' + noun.name + '</span> ';
          var span = document.createElement('span');
          span.classList.add('label');
          span.classList.add('label-primary');
          span.classList.add('focusable');
          span.dataset.key = noun.name.toLowerCase();;
          span.textContent = noun.name;
          span.addEventListener('click', tagHandler);
          element.appendChild(span);
        }
      });
    } else {
      //XXX mock for suggestion tags
      element.innerHTML += '<span id="a" class="label focusable">Instant</span> ';
      element.innerHTML += '<span id="b" class="label focusable">Search</span> ';
      element.innerHTML += '<span id="c" class="label focusable">Suggestions</span> ';
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

var tagHandler = function(evt) {
  if (tip.classList.contains('hidden')) {
    tip.classList.remove('hidden');
  }
  if(evt.target) {
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
};

var clickHandler = function(evt) {
  if (tip.classList.contains('hidden')) {
    tip.classList.remove('hidden');
  }
  var type = evt.target.dataset.type;
  tip.textContent = "tap the row should " + type + ' ' + evt.target.id;
  switch (type) {
    case 'open':
      var url = actionMap[type][
        reverseMap[evt.target.id].idx
      ].url;
      //console.log('open '+ url);
      window.open(url, '_blank');
      break;
    default:
      var url = actionMap['search'][
        reverseMap[evt.target.id].idx
      ].url;
      //console.log('open ' + url + evt.target.dataset.key);
      window.open(url + evt.target.dataset.key, '_blank');
      break;
  }
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
/* MOVED TO ui.js
var searchfield = document.getElementById('search');
var suggestionsSelect = document.getElementById('suggestions-select');
var suggestionTags = document.getElementById('suggestion-tags');
var tip = document.getElementById('tip');
*/

// define all supported verbs
var verbAddons = [verbSearch, verbOpen];

// the universal verb tags pool
var searchPool = [];
// the referece map to origin provider object
var reverseMap = {};

var actionMap = {
  'open': verbOpen.providers,
  'search': verbSearch.providers
};

// TODO: could do in worker
// Initialize action verbs mapping
verbAddons.forEach(function(verb) {
  verb.providers.forEach(function(ele, idx) {
    searchPool.push(ele.name.toLowerCase());
    reverseMap[ele.name.toLowerCase()] = {
      'name': ele.name,
      'type': verb.actionVerb,
      'idx': idx
    };
  });
});

/*
renderTags(suggestionTags);
searchfield.addEventListener('input', processInputs);
searchfield.focus();
registerKeyboardHandlers();
*/
// init end
