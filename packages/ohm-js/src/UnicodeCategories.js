// These are just categories that are used in ES5/ES2015.
// The full list can extracted from https://www.unicode.org/Public/UCD/latest/ucd/extracted/DerivedGeneralCategory.txt.

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
    'Zs'
  ].map(alias => [alias, new RegExp(String.raw`\p{${alias}}`, 'u')])
);
UnicodeCategories['Ltmo'] = /\p{Lt}|\p{Lm}|\p{Lo}/u;
