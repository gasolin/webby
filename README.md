# WebDeacon

[![Build Status](https://travis-ci.org/gasolin/webdeacon.png)](https://travis-ci.org/gasolin/webdeacon) [![Dependency Status](https://david-dm.org/gasolin/webdeacon/dev-status.svg)](https://david-dm.org/gasolin/webdeacon) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Why WebDeacon

The [Prototype](https://gasolin.github.io/webdeacon) is able to:
 * **Open** installed app in new tab
 * (**Widget**) Open app inside of dialog (music, weather)
 * **Search** through default search provider
 * **Search** through different search provider
 * User is **able to add/delete app/widget** in `config > addons`
 * provide instant suggestion through default and target search providers
 * navigation with keyboard

Refer [Test Cases](https://github.com/gasolin/webdeacon/blob/master/TEXTCASES.md) to figure out the usage.

Plan to do

 * Pin app as a **Widget** in dialog
 * Add personality to deacon

## WebDeacon Interaction

Elements: order box, deacon box (order tags, instant search tags, suggestions), chat history

* `Search` and `Open` are the default verbs, we don't need to type them manually.
* `Search providers` are exposed as default verbs. (ex: user could use `wikipedia <keyword>`/`w <keyword>` to search wikipedia directly)

### order-tag-suggestion interface

User is able to found what she needs quickly through keyboard and tags:
* key in on input field to get instant results from several resources
** the tag field will show correspondent order tags and instant suggestion tags
** the suggestion field will show available actions
* Tap order tag will further scoping the selections
* key in to filter order tags, use space to match certain `verb + noun` pattern

### Chat activity

Webdeacon interact with you with chat-like interface. Just like any other instant messengers, all previous dialog are listed as an activity stream.

## Rules

1. respect existing browser searchbar and instant messenger's interactions, so user has pretty small barrier to use Webdeacon.

2. always use `verb + noun` format to execute new commands

Moonbar maintain a defined order(verbs) set on `device`. `noun` generally denotes the `search term`.

3. show all available order tags when no user input

4. while user typing, they can tap tag to further scoping the suggestions

5. Extensions are just normal URLs. User could choose to open it in new window or embed it in the dialog.

## Willing to Contribute?

File a issue to discuss a possible new verb and its usage.

If you are a programmer, clone the project, send a Pull Request to fix the issue you encountered when you use webdeacon.

WebDeacon use [Commitizen](https://github.com/commitizen/cz-cli) to help us write better commit message. When you want commit changes into project, use `git cz` instead of `git commit`.

Make sure you have installed the Commitizen cli tools via command:

```
npm install commitizen -g
```

## Testing

Install dependencies

```
npm install
npm install -g karma-cli
```

Run

```
npm test
```

## Credit

WebDeacon is forked from [Moonbar](https://www.github.com/gasolin/moonbar). The enhanced searchbar with order-tag-suggestion interface.


## license

Mozilla Public License, version 2.0
https://www.mozilla.org/en-US/MPL/2.0/
