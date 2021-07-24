import fs from 'fs'
import test from 'ava'

import { parseMarkdown } from '../markdown.mjs'

test('parsing markdown', t => {
  const source = fs.readFileSync('test/data/test.md');
  t.snapshot(parseMarkdown(source))
});
