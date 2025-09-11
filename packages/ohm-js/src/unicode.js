// The full list of categories from:
// https://www.unicode.org/Public/UCD/latest/ucd/extracted/DerivedGeneralCategory.txt.

const toRegExp = val => new RegExp(String.raw`\p{${val}}`, 'u');

/*
  grep -v '^#' DerivedGeneralCategory.txt \
    | cut -d';' -f2 \
    | awk 'NF{print $1}' \
    | sort -u \
    | awk '{printf "\x27%s\x27,\n",$1}'
 */

export const UnicodeCategories = Object.fromEntries(
  [
    'Cc',
    'Cf',
    'Cn',
    'Co',
    'Cs',
    'Ll',
    'Lm',
    'Lo',
    'Lt',
    'Lu',
    'Mc',
    'Me',
    'Mn',
    'Nd',
    'Nl',
    'No',
    'Pc',
    'Pd',
    'Pe',
    'Pf',
    'Pi',
    'Po',
    'Ps',
    'Sc',
    'Sk',
    'Sm',
    'So',
    'Zl',
    'Zp',
    'Zs',
  ].map(cat => [cat, toRegExp(cat)])
);
UnicodeCategories['Ltmo'] = /\p{Lt}|\p{Lm}|\p{Lo}/u;

// We only support a few of these for now, but could add more later.
// See https://www.unicode.org/Public/UCD/latest/ucd/PropertyAliases.txt
export const UnicodeBinaryProperties = Object.fromEntries(
  ['XID_Start', 'XID_Continue', 'White_Space'].map(prop => [prop, toRegExp(prop)])
);
