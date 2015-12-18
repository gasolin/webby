# Moonbar

## Why Moonbar

We can make Rocketbar more useful and improve productivity for the user via extendable verb commands.

We could backport it to awesomebar on Firefox, Firefox for Android/iOS if its been proven useful.

Prototype: https://jsfiddle.net/gasolin/02gfow19/

Add ability to **Open** installed app and **Search** through search providers.

## What Rocketbar is capable of

Elements: search field, categorized suggestion list

Entrance: When user tap the Rocketbar at the top left, it trigger the whole page, with no content.

Start Input: key in to get instant results from several resources:

1. Web page -> open http/https web sites (just type xxx.com should work..)
2. Search ->
** instant search via default search provider
** change default search provider
3. App ->
** filter, list, and open app
** instant suggestion from marketplace
** (everything.me)

When user tap some characters, the instant search returns several set of results and shown as categorized list on screen.

## Moonbar Interaction

Elements: search field, categorized suggestion list, `tags`

Entrance: When user tap the Moonbar at the top left, it trigger the whole page, with a defined verbs set* (visually shown as tags under the search field). User typing will auto matching the verbs + nouns.

* `Search` and `Open` are the default verbs, we don't need to show or type them.
* `Search providers` are exposed as default verbs. (ex: user could use `wikipedia <keyword>`/`w <keyword>` to search wikipedia directly)

Start Input:
* key in to get instant results from several resources, or
* Tap verb tag then select from the list, or
* key in to filter verb tags, use space to match verb + noun

## Rules

1. respect existing searchbar interactions, so user no need to relearn.

2. use verb + noun format to execute new commands

Moonbar maintain a defined verbs set on `device`.

`noun` (search term)

3. show all available verb tags when no user input

4. while user typing, they can tap tag to scope the suggestions


## Approach land rocket to moonbar

(what firefox for android will do)

1. show instant search via tags
2. show all search options in suggestion list

(new)

3. search through target search provider via partial type (ex: `y moz` should trigger yahoo search)
4. introduce more `verb + noun` pattern

(ubiquity)

5. allow developer add their `verb + noun` pattern to moonbar
