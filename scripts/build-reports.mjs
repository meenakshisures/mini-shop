// Builds reports/results/<id>.json and reports/summary.md from the last Playwright run
// (reports/playwright-results.json). Run it after `npm test`: `npm run reports`.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const root = process.cwd()
const rel = (p) => relative(root, resolve(root, p)).split('\\').join('/')
const BROWSERS = ['chromium', 'firefox', 'webkit']

const run = JSON.parse(readFileSync('reports/playwright-results.json', 'utf8'))
const cases = new Map()

function walk(suite) {
  for (const spec of suite.specs ?? []) {
    const id = spec.file.replace(/^.*[\\/]/, '').replace('.spec.ts', '')
    for (const t of spec.tests) {
      const result = t.results[t.results.length - 1]
      if (!result) continue
      const entry = cases.get(id) ?? { id, title: spec.title.replace(/^[A-Z]+-\d+: /, ''), file: spec.file, browsers: {}, attempts: 0, knownBug: null }
      const attachments = result.attachments ?? []
      const path = (name) => attachments.find((a) => a.name === name)?.path
      entry.browsers[t.projectName] = {
        status: result.status === 'passed' ? 'passed' : 'failed',
        screenshot: path('screenshot') ? rel(path('screenshot')) : null,
        trace: path('trace') ? rel(path('trace')) : null,
        error: result.error?.message?.replace(/\u001b\[[0-9;]*m/g, '').split('\n').slice(0, 8).join('\n') ?? null,
      }
      entry.attempts = Math.max(entry.attempts, t.results.length)
      const bug = (t.annotations ?? []).find((a) => a.type === 'known-bug')
      if (bug) entry.knownBug = bug.description
      cases.set(id, entry)
    }
  }
  for (const child of suite.suites ?? []) walk(child)
}
run.suites.forEach(walk)
cases.delete('auth.setup.ts')

for (const name of readdirSync('reports/results').filter((file) => file.endsWith('.json'))) {
  const id = name.replace(/\.json$/, '')
  if (cases.has(id)) continue
  const saved = JSON.parse(readFileSync(`reports/results/${name}`, 'utf8'))
  cases.set(id, {
    id,
    title: saved.title,
    file: saved.script,
    browsers: saved.browsers,
    attempts: saved.attempts,
    knownBug: saved.knownBug,
    saved,
  })
}

// Locators come from the page objects a spec imports (defined once in tests/pages).
function locatorsFor(specFile) {
  const src = readFileSync(`tests/specs/${specFile.replace(/^.*[\/]/, '')}`, 'utf8')
  const out = {}
  for (const [, page] of src.matchAll(/from '\.\.\/pages\/(\w+)'/g)) {
    const code = readFileSync(`tests/pages/${page}.ts`, 'utf8')
    for (const [, name, locator] of code.matchAll(/this\.(\w+) = (page\.[^\n]+)/g)) out[`${page}.${name}`] = locator.replace(/^page\./, '').trim()
    for (const [, name, locator] of code.matchAll(/(\w+)\([^)]*\) \{\s*return this\.page\.(get\w+\([^\n]+\))/g)) out[`${page}.${name}()`] = locator
  }
  return out
}

mkdirSync('reports/results', { recursive: true })
const rows = []
for (const c of [...cases.values()].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))) {
  if (c.saved) {
    rows.push({
      ...c,
      status: c.saved.status,
      reason: c.saved.error,
      locators: c.saved.locators,
    })
    continue
  }
  const failed = BROWSERS.filter((b) => c.browsers[b]?.status === 'failed')
  const status = failed.length ? 'failed' : 'passed'
  const firstError = failed.length ? c.browsers[failed[0]].error : null
  const errorSummary = firstError?.split('\n').filter((line) => /Expected|Received|Error|timeout/i.test(line)).join(' ').replace(/\s+/g, ' ')
  const reason = failed.length
    ? `${c.knownBug ? `Known app bug: ${c.knownBug}. ` : ''}${errorSummary || firstError}`
    : null
  const old = existsSync(`reports/results/${c.id}.json`) ? JSON.parse(readFileSync(`reports/results/${c.id}.json`, 'utf8')) : {}
  const attemptLog = old.attemptLog ?? []
  const attempts = Math.max(c.attempts, attemptLog.length)
  writeFileSync(
    `reports/results/${c.id}.json`,
    JSON.stringify({ id: c.id, title: c.title, status, knownBug: c.knownBug, error: reason, locators: locatorsFor(c.file), script: rel(c.file.startsWith('tests') ? c.file : `tests/specs/${c.file}`), browsers: c.browsers, attempts, attemptLog }, null, 2),
  )
  rows.push({ ...c, status, reason, failed, attempts, locators: locatorsFor(c.file) })
}

const passed = rows.filter((r) => r.status === 'passed').length
const mark = (c, b) => (c.browsers[b] ? (c.browsers[b].status === 'passed' ? '✅' : '❌') : '—')
const link = (p, text) => (p ? `[${text}](../${p})` : null)
const lines = [
  '# Test Results Summary',
  '',
  'Full interactive report (screenshots, traces, steps): `playwright-report/index.html`, open it with `npm run report`.',
  '',
  `- Total test cases: ${rows.length}`,
  `- Passed: ${passed}`,
  `- Failed: ${rows.length - passed} (${rows.filter((r) => r.status === 'failed' && r.knownBug).length} caused by the documented app bugs)`,
  `- Pass rate: ${rows.length ? Math.round((passed / rows.length) * 100) : 0}% (${passed} / ${rows.length})`,
  `- Browsers: ${BROWSERS.join(', ')}`,
  '',
  '| TestID | title | status | attempts | browsers | locators | failure reason | script path | screenshot / trace link |',
  '|---|---|---|---:|---|---|---|---|---|',
]
for (const r of rows) {
  const arts = BROWSERS.filter((b) => r.browsers[b])
    .map((b) => [link(r.browsers[b].screenshot, `${b} screenshot`), link(r.browsers[b].trace, 'trace')].filter(Boolean).join(' / '))
    .join('<br>')
  lines.push(
    `| ${r.id} | ${r.title} | ${r.status === 'passed' ? 'passed' : '**failed**'} | ${r.attempts ?? '—'} | ${BROWSERS.map((b) => `${b}: ${mark(r, b)}`).join('<br>')} | ${Object.entries(r.locators ?? {}).map(([k, v]) => `\`${k}\` = \`${v.replace(/\|/g, '\\|')}\``).join('<br>') || '—'} | ${r.reason ? r.reason.replace(/\|/g, '\\|') : '—'} | [${r.id}.spec.ts](../tests/specs/${r.id}.spec.ts) | ${arts || '—'} |`,
  )
}
writeFileSync('reports/summary.md', lines.join('\n') + '\n')
console.log(`${rows.length} cases, ${passed} passed, ${rows.length - passed} failed -> reports/summary.md`)
