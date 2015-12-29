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
    url: 'https://www.bing.com/search?form=OSDSRC&q=',
    suggest: 'http://api.bing.com/osjson.aspx?form=OSDJAS&query='
  }, {
    name: 'Wikipedia',
    url: 'http://en.wikipedia.org/w/index.php?title=Special:Search&search=',
    suggest: 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
  }, {
    name: 'GitHub',
    url: 'http://github.com/search?type=Everything&repo=&langOverride=&start_value=1&q=',
    suggest: ''
  }, {
    name: 'Translate',
    url: 'http://translate.google.com/?q=',
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
