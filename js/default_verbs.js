/* export defaultVerbStore */
'use strict';

var verbSearch = {
  actionVerb: 'search',
  version: '0.4',
  providers: [{
    name: 'Google',
    url: 'https://www.google.com/search?q={term}',
    suggest: 'https://www.google.com/complete/search?client=firefox&q={term}'
  }, {
    name: 'Yahoo',
    url: 'https://search.yahoo.com/search?p={term}',
    suggest: 'https://search.yahoo.com/sugg/ff?output=fxjson&command={term}'
  }, {
    name: 'Bing',
    url: 'https://www.bing.com/search?form=OSDSRC&q={term}',
    suggest: 'http://api.bing.com/osjson.aspx?form=OSDJAS&query={term}'
  }, {
    name: 'Wikipedia',
    url: 'http://en.wikipedia.org/w/index.php?title=Special:Search&search={term}',
    suggest: 'http://en.wikipedia.org/w/api.php?action=opensearch&search={term}'
  }, {
    name: 'GitHub',
    url: 'http://github.com/search?type=Everything&repo=&langOverride=&start_value=1&q={term}',
    suggest: ''
  }, {
    name: 'Translate',
    url: 'http://translate.google.com/?q={term}',
    suggest: ''
  }],
  default: 0,
  flattern: true // turn each provider as a tag
};

var verbOpen = {
  actionVerb: 'open',
  version: '0.3',
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
    url: 'http://douban.fm/partner/firefox',
    embed: true
  }, {
    name: 'Tasks',
    url: 'https://mail.google.com/tasks/android',
  }, {
    name: 'ShareDrop',
    url: 'https://snapdrop.net/'
  }, {
    name: 'Weather',
    url: 'http://gasolin.github.io/accuwidget/',
    embed: true
  }],
  default: 0
};

var verbConfig = {
  actionVerb: 'config',
  version: '0.5',
  providers: [{
    name: 'Addons',
    url: 'widgets/addons.html',
    embed: true
  }, {
    name: 'Report Issue',
    url: 'https://github.com/gasolin/webby/issues'
  }, {
    name: 'About',
    url: 'https://github.com/gasolin/webby'
  }],
  default: 0
};

var defaultVerbStore = [verbSearch, verbOpen, verbConfig];
