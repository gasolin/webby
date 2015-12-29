'use strict';
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
  default: 0,
  flattern: true // turn each provider as a tag
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

var verbConfig = {
  actionVerb: 'config',
  providers: [{
    name: 'about',
    url: 'https://github.com/gasolin/moonbar'
  }],
  default: 0
};
