# Moonbar

## Why Moonbar

We can make Rocketbar more useful and improve productivity for the user via extendable verb commands.

We could backport it to awesomebar on Firefox, Firefox for Android/iOS if its been proven useful.

The [Prototype](https://gasolin.github.io/moonbar) is able to:
 * **Open** installed app
 * **Search** through default search provider
 * **Search** through different search provider

Refer [Test Cases](https://github.com/gasolin/moonbar/blob/master/TEXTCASES.md) to figure out the usage.

## What Rocketbar is capable of

Elements: search field, categorized suggestion list

Entrance: When user tap the Rocketbar at the top left, it trigger the whole page, `with no content`.

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

Elements: search field, categorized suggestion list, `verb tags` and instant search tags

Entrance: When user tap the Moonbar at the top left, it trigger the whole page, and list ` a supported verbs set`* (visually shown as tags under the search field). User typing will auto matching the `verbs + nouns` pattern.

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


## Approach land rocket to moonbar

(what firefox for android will do)

1. show instant search via tags
2. show all search options in suggestion list

(new)

3. search through target search provider via partial type (ex: `y moz` should trigger yahoo search)
4. introduce more `verb + noun` pattern

(ubiquity)

5. allow developer add their `verb + noun` pattern to moonbar


## Willing to Contribute?

File a issue to discuss a possible new verb and its usage.

If you are a programmer, try [jsfiddle](https://jsfiddle.net/gasolin/02gfow19/
) to prototype your verbs. Or clone the project, send a Pull Request to fix the issue you encountered when you use moonbar.
