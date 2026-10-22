// Normalizes every row of a test case CSV into test-cases/parsed/<TestID>.json
// (same shape as the test-case-parser skill). Usage: node scripts/parse-csv.mjs [file.csv]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const file = process.argv[2] ?? 'test-cases/test-cases.csv'

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') { row.push(cell); cell = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell); cell = ''
      if (row.some(Boolean)) rows.push(row)
      row = []
    } else cell += ch
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

const [header, ...records] = parseCsv(readFileSync(file, 'utf8'))
mkdirSync('test-cases/parsed', { recursive: true })

for (const record of records) {
  const r = Object.fromEntries(header.map((h, i) => [h.trim(), (record[i] ?? '').trim()]))
  const steps = r.Steps.split(/;\s*(?=\d+\.)/).map((s) => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean)
  const testCase = {
    id: r.TestID,
    title: r.Title,
    preconditions: r.Preconditions ? [r.Preconditions] : [],
    steps,
    testData: r['Test Data'] ? { raw: r['Test Data'] } : {},
    expectedResult: r['Expected Result'],
  }
  if (!testCase.id || !steps.length || !testCase.expectedResult) {
    console.error(`Row ${testCase.id || '?'} is missing an id, steps or expected result: ask for clarification.`)
    continue
  }
  writeFileSync(`test-cases/parsed/${testCase.id}.json`, JSON.stringify(testCase, null, 2) + '\n')
}
console.log(`Parsed ${records.length} rows from ${file}`)
