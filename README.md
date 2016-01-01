# WebDeacon

[![Build Status](https://travis-ci.org/gasolin/webdeacon.png)](https://travis-ci.org/gasolin/webdeacon)

## Why WebDeacon


The [Prototype](https://gasolin.github.io/webdeacon) is able to:
 * **Open** installed app
 * **Search** through default search provider
 * **Search** through different search provider
 * provide instant suggestion through default and target search provider
 * navigation with keyboard

Refer [Test Cases](https://github.com/gasolin/webdeacon/blob/master/TEXTCASES.md) to figure out the usage.

## WebDeacon Interaction

Elements: order box, deacon box (order tags, instant search tags, suggestions), chat history

* `Search` and `Open` are the default verbs, we don't need to type them manually.
* `Search providers` are exposed as default verbs. (ex: user could use `wikipedia <keyword>`/`w <keyword>` to search wikipedia directly)

User is able to found what she needs quickly through keyboard and tags:
* key in on input field to get instant results from several resources
** the tag field will show correspondent action tags
** the suggestion field will show available suggestions
* Tap verb tag will further scoping the selections
* key in to filter verb tags, use space to match `verb + noun` pattern

## Rules

1. respect existing searchbar interactions, so user no need to relearn.

2. use verb + noun format to execute new commands

Moonbar maintain a defined verbs set on `device`.

`noun` (search term)

3. show all available verb tags when no user input

4. while user typing, they can tap tag to scope the suggestions


## Willing to Contribute?

File a issue to discuss a possible new verb and its usage.

If you are a programmer, clone the project, send a Pull Request to fix the issue you encountered when you use webdeacon.

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
