# Generating grammars

The grammars in this package are generated automatically generated. Below are some notes on the process from [@elgertam][] — see [#452][] for more details.

[@elgertam]:
[#452]: https://github.com/ohmjs/ohm/pull/452

The extraction process I followed is essentially as you described: download the spec files (from https://raw.githubusercontent.com/tc39/ecma262/gh-pages/{YEAR}/index.html e.g. https://raw.githubusercontent.com/tc39/ecma262/gh-pages/2016/index.html), run them through my extract-grammarkdown.mjs and optionally dedent.py, open in VSCode (using two VSCode extensions for grammarkdown), and remove extraneous productions until the grammar has no errors.

Automation may be possible, especially for the newer grammars. Older grammars have loads of duplicated productions that need to be removed, which were removed using manual clean-up here. These may be extractable in the future with improvements to Ohm's Grammarkdown tooling.

Here's the backstory:

I did quite a bit of digging around ecmarkup and the grammarkdown tools (that's why ecmarkup was still in pkg dependencies) to see if I could extract a grammar from a spec using official tools, and despite a few hints from Ron Buckton that grammars could be extracted, I wasn't able to do so. The grammarkdown tool in particular was difficult to use and understand. Apparently the ecmarkup maintainers feel the same way, because there are comments in the source about how difficult it is to work with.

I wanted to avoid further yak shaving so used my own hacked together tools (extract-grammarkdown.mjs and dedent.py). I then downloaded all the spec HTML files for ES20[16..22] and ran them through the tooling.

Grammars older than ES2018 needed quite a bit of cleanup. The ecmarkup <emu-grammar> tags used in those did not differentiate between instances of snippets or specifications, so many productions, or parts of them, were repeated over and over for commentary & explanatory purposes. I used two the two VSCode extensions, published by Ron Buckton himself, to work with the extracted grammars until all of the extraneous productions were removed and there were no more errors. (That is the genesis of the spec.strict.grammar – Grammarkdown has a "strict" mode where all parameters need to be fully specified unless a certain pragma is applied.) In a couple of cases (can't remember which ones at this point), I found grammar summaries in the spec that were subtly wrong because the production in the grammar summary was taken from the wrong section of the spec.

Grammars for ES2018 or newer were all simple to extract using basic DOM APIs and IIRC only needed minimal cleanup.
