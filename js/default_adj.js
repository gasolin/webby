/* export defaultAdjStore */
'use strict';

var defaultAdjStore = {
  showWidget: '<iframe src="{url}" height="320" width="480" ' +
    'frameBorder="0"></iframe>',
  showWebhook: '{name} pinged',
  showWebhookFailed: '{name} failed: {msg}',
  showLink: 'Here you are: <a href="{url}" target="_blank">{provider}</a>',
  actionSearch: '{verb} "{searchTerms}" with {provider}',
  actionSearchReply: 'I am {verb}ing "{searchTerms}" with {provider}...<br/>' +
    'Here you are: <a href="{url}" target="_blank">{searchTerms} ' +
    'on {provider}</a>',
  actionOpen: 'Open "{provider}"',
  actionConfig: 'Open configuration "{provider}"'
};
