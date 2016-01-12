/*globals localforage */
'use strict';

/**
 * Manage chat stream.
 */
var chatKey = 'chatstore';
var DialogManager = {
  _container: null,
  _chatSteam: [],

  init: function(element) {
    this._container = element;
    localforage.getItem(chatKey, function(err, value) {
      if (err) {
        console.error(err);
      } else {
        var dialogs = JSON.parse(value);
        if (dialogs) {
          this._chatSteam = dialogs;
          this.renderAll();
        }
      }
    }.bind(this));
  },

  push: function(item) {
    if (item.hasOwnProperty('timestamp')) {
      item.timestamp = Date.now();
    }
    this._chatSteam.push(item);
    this.render(item);

    // cache last 8 items
    var len = this._chatSteam.length;
    if(len > 8) {
      this._chatSteam.splice(0, len - 8);
    }
    localforage.setItem(chatKey, JSON.stringify(this._chatSteam))
      .then(function() {
        // console.log('dialog cached');
      });
  },

  render: function(item) {
    var chatbox = document.createElement('section');
    chatbox.classList.add('chat', item.speaker + '-chat');
    //chatbox.textContent = "I am " + target.dataset.type + "ing \"" + decodeURI(target.dataset.key) + "\" with " + target.id;
    chatbox.innerHTML = item.msg;
    this._container.appendChild(chatbox);
  },

  renderAll: function() {
    this._chatSteam.forEach(function(item) {
      var chatbox = document.createElement('section');
      chatbox.classList.add('chat', item.speaker + '-chat');
      //chatbox.textContent = "I am " + target.dataset.type + "ing \"" + decodeURI(target.dataset.key) + "\" with " + target.id;
      chatbox.innerHTML = item.msg;
      this._container.appendChild(chatbox);
    }.bind(this));
  }
};
