/*globals localforage, defaultVerbStore */
'use strict';

var stoerKey = 'verbstore';
var configs = document.getElementById('configs');
var reset = document.getElementById('reset');
var tip = document.getElementById('tip');

localforage.getItem(stoerKey, function(err, value) {
  if (err) {
    console.error(err);
  } else {
    var verbAddons = JSON.parse(value);
    if (verbAddons) {
      verbAddons.forEach(function(verbAddon) {
        // <h3>open</h3>
        // <ul>
        //   <li>| name: orz | url: www.orz.org | embed: true | </li>
        // </ul>
        var header = document.createElement('h3');
        header.textContent = verbAddon.actionVerb;
        var ul = document.createElement('ul');
        configs.appendChild(header);
        configs.appendChild(ul);

        verbAddon.providers.forEach(function(provider) {
          var li = document.createElement('li');
          li.textContent = '| ';
          for (var prop in provider) {
            if(provider.hasOwnProperty(prop)) {
              li.textContent += prop + ': ' + provider[prop] + ' | ';
            }
          }
          ul.appendChild(li);
        });

        // enable user to add new app for open verb
        if (verbAddon.actionVerb === 'open') {
          var link = document.createElement('a');
          link.href = '#openform';
          link.id = verbAddon.actionVerb;
          link.textContent = 'Add new app';
          configs.appendChild(link);
          var form = document.createElement('form');
          form.id = 'openform';
          configs.appendChild(form);

          link.addEventListener('click', function() {
            form.innerHTML = '<label for="name">Name</label>' +
              '<input class="form-control" id="name">' +
              '<label for="url">URL</label>' +
              '<input class="form-control" id="url">' +
              '<select id="embed" class="form-control">' +
              '<option value="true" selected>True</option>' +
              '<option value="false">False</option>' +
              '</select>' +
              '<button id="addapp" class="btn btn-primary">Add App</button>';

            form.addapp.addEventListener('click', function() {
              console.log(form.name.value + ' | ' + form.url.value + ' | ' +
                form.embed.value);
              var isEmbed = form.embed.value === 'true' ? true : false;
              verbAddon.providers.push({
                name: form.name.value,
                url: form.url.value,
                embed: isEmbed
              });
              localforage.setItem(stoerKey, JSON.stringify(verbAddons))
              .then(function() {
                alert('App ' + form.name.value +
                  ' added, reload the page to access the new app');
              });
            });
          });
        }
      });
    }
  }
});

reset.addEventListener('click', function() {
  localforage.setItem(stoerKey,
    JSON.stringify(defaultVerbStore)).then(function() {
      if (tip.classList.contains('hidden')) {
        tip.classList.remove('hidden');
      }
      tip.textContent = 'please reload the page';
    });
});
