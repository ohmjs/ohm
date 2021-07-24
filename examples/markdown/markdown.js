import ohm from 'ohm-js'
import { promises as fs } from 'fs'

const H1    = (content) => ({type:'H1', content})
const H2    = (content) => ({type:'H2',content})
const H3    = (content) => ({type:'H3',content})
const P     = (content) => ({type:'P',content})
const LI    = (content) => ({type:'LI',content})
const code  = (language,content) => ({type:'CODE', language, content})

function parse_markdown_blocks(str) {
    let parser = {}
    parser.grammar = ohm.grammar(`
MarkdownOuter {
  doc = block+
  block =  blank | h3 | h2 | h1 | bullet | code | para | endline
  h3 = "###" rest
  h2 = "##" rest
  h1 = "#" rest  
  para = line+ //paragraph is just multiple consecutive lines
  bullet = "* " rest (~"*" ~blank rest)*
  code = q rest (~q any)* q //anything between the \`\`\` markers
  q = "\`\`\`"   // start and end code blocks
  nl = "\\n"   // new line
  sp = " "
  blank = sp* nl  // blank line has only newline
  endline = (~nl any)+ end
  line = (~nl any)+ nl  // line has at least one letter
  rest = (~nl any)* nl  // everything to the end of the line
}

    `)
    parser.semantics = parser.grammar.createSemantics()
    parser.semantics.addOperation('blocks',{
        _terminal() { return this.sourceString },
        h1:(_,b) => H1(b.blocks()),
        h2:(_,b) => H2(b.blocks()),
        h3:(_,b) => H3(b.blocks()),
        code:(_,name,cod,_2) => code(name.blocks(),cod.blocks().join("")),
        para: a=> P(a.sourceString),
        blank: (a,b) => ({type:'BLANK'}),
        bullet: (a,b,c) => LI(b.sourceString + c.sourceString),
        rest: (a,_) => a.blocks().join("")
    })
    let match = parser.grammar.match(str)
    return parser.semantics(match).blocks()
}
function parse_markdown_content(block) {
    // l("parsing markdown inside block",block)
    let parser = {}
    parser.grammar = ohm.grammar(`
MarkdownInner {
  block = para*
  para = link | bold | italic | code | plain
  plain = ( ~( "*" | "\`" | "[" | "__") any)+
  bold = "*" (~"*" any)* "*"
  italic = "__" (~"__" any)* "__"
  code = "\`" (~"\`" any)* "\`"
  link = "!"? "[" (~"]" any)* "]" "(" (~")" any)* ")"
}
    `)
    parser.semantics = parser.grammar.createSemantics()
    parser.semantics.addOperation('content',{
        _terminal() { return this.sourceString },
        plain(a) {return ['plain',a.content().join("")] },
        bold(_1,a,_2) { return ['bold',a.content().join("")] },
        italic(_1,a,_2) { return ['italic',a.content().join("")] },
        code:(_1,a,_2) => ['code',a.content().join("")],
        link:(img,_1,text,_2,_3,url,_4) => ['link',
            text.content().join(""),
            url.content().join(""),
            img.content().join("")]
    })
    let match = parser.grammar.match(block.content)
    if(match.failed()) {
        l("match failed on block",block)
        block.content = [['plain',block.content]]
    } else {
        block.content = parser.semantics(match).content()
    }
    return block
}


export async function parse_markdown(raw_markdown) {
    let blocks = parse_markdown_blocks(raw_markdown)
    return blocks.map(block => {
        if(block.type === 'P') return parse_markdown_content(block)
        if(block.type === 'LI') return parse_markdown_content(block)
        return block
    })
}


fs.readFile("test.md")
    .then(raw => parse_markdown(raw))
    .then(md => console.log(JSON.stringify(md,null,'   ')))
