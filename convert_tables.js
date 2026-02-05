import { readFileSync, writeFileSync } from 'fs';

const content = readFileSync('src/feel_spec.md', 'utf8');
const lines = content.split('\n');

const newLines = lines.filter(line => {

  // Remove grid table border lines (lines starting with + and containing - or =)
  return !line.match(/^\+[-=]+/);
});

writeFileSync('src/feel_spec.md', newLines.join('\n'));
console.log('Grid table borders removed');
