import argparse
import textwrap

def dedent_grammar(grammar_text: str):
    grammar_lines = grammar_text.split('\n')

    block_start = 0
    blocks = []

    for i, line in enumerate(grammar_lines):
        if i > block_start and line.startswith('@line'):
            blocks.append({
                "line": grammar_lines[block_start],
                "start": block_start + 1,
                "end": i,
            })
            block_start = i
    blocks.append({
        "line": grammar_lines[block_start],
        "start": block_start + 1,
        "end": len(grammar_lines) - 1
    })

    dedented_blocks = []

    for block in blocks:
        line = block['line']
        start = block['start']
        end = block['end']
        block_text = '\n'.join(grammar_lines[start:end])
        dedented_block = textwrap.dedent(block_text)
        dedented_blocks.append(line + '\n' + dedented_block)

    dedented_grammar_text = '\n'.join(dedented_blocks)

    return dedented_grammar_text


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('grammar_file', help='grammarkdown file')
    args = parser.parse_args()

    with open(args.grammar_file, 'r') as f:
        grammar_text = f.read()
    print(dedent_grammar(grammar_text))
