// These are just categories that are used in ES5/ES2015.
// The full list of Unicode categories is here: http://www.fileformat.info/info/unicode/category/index.htm.
export const UnicodeCategories = {
  // Letters
  Lu: /\p{Lu}/u,
  Ll: /\p{Ll}/u,
  Lt: /\p{Lt}/u,
  Lm: /\p{Lm}/u,
  Lo: /\p{Lo}/u,

  // Numbers
  Nl: /\p{Nl}/u,
  Nd: /\p{Nd}/u,

  // Marks
  Mn: /\p{Mn}/u,
  Mc: /\p{Mc}/u,

  // Punctuation, Connector
  Pc: /\p{Pc}/u,

  // Separator, Space
  Zs: /\p{Zs}/u,

  // These two are not real Unicode categories, but our useful for Ohm.
  // L is a combination of all the letter categories.
  // Ltmo is a combination of Lt, Lm, and Lo.
  L: /\p{Letter}/u,
  Ltmo: /\p{Lt}|\p{Lm}|\p{Lo}/u,
};
