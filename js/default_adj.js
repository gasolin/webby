/* export defaultAdjStore */
'use strict';

var defaultAdjStore = {
  showWidget: '<iframe src="{url}" height="320" width="480" ' +
    'frameBorder="0"></iframe>',
  showLink: 'Here you are: <a href="{url}" target="_blank">{provider}</a>',
  actionSearch: '{verb} "{term}" with {provider}',
  actionSearchReply: 'I am {verb}ing "{term}" with {provider}...<br/>' +
    'Here you are: <a href="{url}" target="_blank">{term} ' +
    'on {provider}</a>',
  actionOpen: 'Open "{provider}"',
  actionConfig: 'Open configuration "{provider}"'
};
