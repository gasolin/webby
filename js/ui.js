document.body.classList.remove('hidden');

// init start
var searchfield = document.getElementById('search');
var suggestionsSelect = document.getElementById('suggestions-select');
var suggestionTags = document.getElementById('suggestion-tags');
var tip = document.getElementById('tip');

renderTags(suggestionTags);
searchfield.addEventListener('input', processInputs);
searchfield.focus();
registerKeyboardHandlers();
// init end
