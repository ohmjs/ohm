import { parseArgs } from 'util'
import jsdom from 'jsdom'
import fs from 'fs'
const { JSDOM } = jsdom

const USAGE =
`Usage: extract-markdown.mjs <grammar_file>

Options:
  -h --help   Print this message.
`

const extractProductions = (specText) => {

  const dom = new JSDOM(specText, {
    includeNodeLocations: true,
  })

  const emuNodes = dom.window.document.querySelectorAll('emu-grammar[type=definition]')

  // Older versions of the grammars prior to ES2018 didn't use the
  // `type="definition"` attribute on <emu-grammar> elements, so we use
  // the less specific selector & manually remove extraneous productions
  if (emuNodes.length === 0) {
    emuNodes = dom.window.document.querySelectorAll('emu-grammar')
  }

  const grammarkdownText = Array.from(emuNodes, (e) => {
    return [`@line ${dom.nodeLocation(e).startLine}`, e.textContent].join('\n')
  }).join('\n')

  return grammarkdownText
}

const main = () => {
  const parseConfig = {
    allowPositionals: true,
    options: {
      help: {
        short: 'h',
        type: 'boolean',
      }
    }
  }

  const args = parseArgs(parseConfig)

  if (args.values.help || args.positionals.length < 1) {
    console.error(USAGE)
    process.exit(!args.values.help)
  }

  const spec = fs.readFileSync(args.positionals[0], {encoding: 'utf-8'})
  const grammarText = extractProductions(spec)
  console.log(grammarText)
}

main()





