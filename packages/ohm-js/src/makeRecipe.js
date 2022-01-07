'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const Builder = require('./Builder');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeRecipe(recipe) {
  if (typeof recipe === 'function') {
    return recipe.call(new Builder());
  } else {
    if (typeof recipe === 'string') {
      // stringified JSON recipe
      recipe = JSON.parse(recipe);
    }
    return new Builder().fromRecipe(recipe);
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makeRecipe = makeRecipe;
