// Every advice file must be valid JSON with a version and a date (YYYY-MM-DD).
// A file whose content changed against the previous commit must carry a later date.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const base = process.argv[2] || 'HEAD~1';
let failed = false;
const fail = (message) => { console.error('✖ ' + message); failed = true; };
for (const topic of readdirSync('.')) {
  if (topic.startsWith('.') || !statSync(topic).isDirectory() || topic === 'scripts') continue;
  for (const name of readdirSync(topic)) {
    const path = topic + '/' + name;
    if (!/^v\d+\.json$/.test(name)) { fail(path + ': only v<n>.json files belong in a topic folder'); continue; }
    const text = readFileSync(path, 'utf8');
    let data;
    try { data = JSON.parse(text); } catch (e) { fail(path + ': invalid JSON (' + e.message + ')'); continue; }
    if (!Number.isInteger(data.version)) fail(path + ': "version" must be an integer');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date || '')) { fail(path + ': "date" must be YYYY-MM-DD'); continue; }
    let previous;
    try { previous = execFileSync('git', ['show', base + ':' + path], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { previous = null; }
    if (previous === null || previous === text) { console.log('✔ ' + path + (previous === null ? ' (new)' : ' (unchanged)')); continue; }
    let before;
    try { before = JSON.parse(previous); } catch { before = {}; }
    if (before.version !== undefined && before.version !== data.version) fail(path + ': the structure version must not change; add a new v<n+1>.json instead');
    if (!(data.date > (before.date || ''))) fail(path + ': content changed, so "date" must be later than ' + before.date);
    else console.log('✔ ' + path + ' (changed, date ' + before.date + ' → ' + data.date + ')');
  }
}
process.exit(failed ? 1 : 0);
