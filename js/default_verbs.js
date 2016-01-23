/* export defaultVerbStore */
'use strict';

/*
 * Default verbs are loaded and store to local indexed DB when user open webby
 * at first time.
 *
 * default verb structure:
 *
 * var verbXxx = {
 *  actionVerb: 'Xxx', //verb name
 *  version: '0.1',
 *  providers: [
 *    {
 *      name:,
 *      url:,
 *      otherAttribute:,
 *    }
 *  ],
 *  default: 0, // default provider
 *  indexing: both | provider | verb
 * };
 *
 * verb means it should only indexing verb, so providers are not searchable
 * provider means it should only indexing providers, verb is not searchable
 */

/**
 * Search providers.
 * suggest attribute is used for instant suggestion
 */
var verbSearch = {
  actionVerb: 'search',
  version: '0.6',
  providers: [{
    name: 'Google',
    url: 'https://www.google.com/search?q={searchTerms}',
    suggest: 'https://www.google.com/complete/search?client=firefox&q={searchTerms}'
  }, {
    name: 'Yahoo',
    url: 'https://search.yahoo.com/search?p={searchTerms}',
    suggest: 'https://search.yahoo.com/sugg/ff?output=fxjson&command={searchTerms}'
  }, {
    name: 'Bing',
    url: 'https://www.bing.com/search?form=OSDSRC&q={searchTerms}',
    suggest: 'http://api.bing.com/osjson.aspx?form=OSDJAS&query={searchTerms}'
  }, {
    name: 'Wikipedia',
    url: 'http://en.wikipedia.org/w/index.php?title=Special:Search&search={searchTerms}',
    suggest: 'http://en.wikipedia.org/w/api.php?action=opensearch&search={searchTerms}'
  }, {
    name: 'GitHub',
    url: 'http://github.com/search?type=Everything&repo=&langOverride=&start_value=1&q={searchTerms}',
    suggest: ''
  }, {
    name: 'Translate',
    url: 'http://translate.google.com/?q={searchTerms}',
    suggest: ''
  }],
  default: 0,
  indexing: 'provider' // turn each provider as a tag
};

/**
 * Open apps and widgets.
 * embed attribute is used to note this app should be open in iframe (widget)
 */
var verbOpen = {
  actionVerb: 'open',
  version: '0.5',
  providers: [{
    name: 'Facebook',
    url: 'http://www.facebook.com/',
    type: 'site'
  }, {
    name: 'Twitter',
    url: 'http://www.twitter.com/',
    type: 'site'
  }, {
    name: 'Calendar',
    url: 'http://calendar.google.com/',
    type: 'site'
  }, {
    name: 'Email',
    url: 'http://www.gmail.com/',
    type: 'site'
  }, {
    name: 'Gallery',
    url: 'http://www.flickr.com/',
    type: 'site'
  }, {
    name: 'Music',
    url: 'http://douban.fm/partner/firefox',
    type: 'widget'
  }, {
    name: 'Tasks',
    url: 'https://mail.google.com/tasks/android',
    type: 'site'
  }, {
    name: 'ShareDrop',
    url: 'https://snapdrop.net/',
    type: 'site'
  }, {
    name: 'Weather',
    url: 'http://gasolin.github.io/accuwidget/',
    type: 'widget'
  }, {
    name: '42goals',
    url: 'http://42goals.com/goals/',
    type: 'widget'
  }],
  default: 0,
  indexing: 'both'
};

/**
 * Supportive and Webby relate configurations.
 */
var verbConfig = {
  actionVerb: 'config',
  version: '0.7',
  providers: [{
    name: 'About',
    url: 'https://github.com/gasolin/webby',
    type: 'site'
  }, {
    name: 'Addons',
    url: 'widgets/addons.html',
    type: 'widget'
  }, {
    name: 'preferences',
    url: 'widgets/pref.html',
    type: 'widget'
  }, {
    name: 'Report Issue',
    url: 'https://github.com/gasolin/webby/issues',
    type: 'site'
  }],
  default: 0,
  indexing: 'both'
};

var defaultVerbStore = [verbSearch, verbOpen, verbConfig];
