// scripts/update-version.js
// Usage:
//   node scripts/update-version.js 7.41d
//   node scripts/update-version.js 7.41d --except spirit_breaker huskar
//   node scripts/update-version.js 7.41d --only spirit_breaker huskar
//   node scripts/update-version.js 7.41d --dry-run
//   (later, for items:)  node scripts/update-version.js 7.41d --dir items

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const version = args[0];

if (!version) {
  console.error('Usage: node scripts/update-version.js <version> [--except id...|--only id...] [--dry-run] [--dir heroes]');
  process.exit(1);
}
if (!/^\d+\.\d+[a-z]?$/.test(version)) {
  console.error(`"${version}" doesn't look like a patch version (e.g. 7.41 or 7.41d). Aborting; re-run if you're sure.`);
  process.exit(1);
}

let mode = null, list = [], dryRun = false, dir = 'heroes';
for (let i = 1; i < args.length; i++) {
  const a = args[i];
  if (a === '--dry-run') dryRun = true;
  else if (a === '--dir') dir = args[++i];
  else if (a === '--except') mode = 'except';
  else if (a === '--only') mode = 'only';
  else if (mode) list.push(a);
}

const targetDir = path.resolve(process.cwd(), dir);
const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.json'));
const VERSION_RE = /("version"\s*:\s*")[^"]*(")/;

let updated = 0, skipped = 0, problems = [];
for (const file of files) {
  const id = path.basename(file, '.json');
  const excluded = (mode === 'except' && list.includes(id)) ||
                   (mode === 'only'   && !list.includes(id));
  if (excluded) { skipped++; continue; }

  const full = path.join(targetDir, file);
  const text = fs.readFileSync(full, 'utf8');            // whole file as one string → line endings untouched
  const hits = text.match(new RegExp(VERSION_RE, 'g'));
  if (!hits)            { problems.push(`${file}: no version field found`); continue; }
  if (hits.length > 1)  { problems.push(`${file}: ${hits.length} version fields (expected 1) — skipped`); continue; }

  if (!dryRun) fs.writeFileSync(full, text.replace(VERSION_RE, `$1${version}$2`), 'utf8');
  updated++;
}

console.log(`${dryRun ? '[dry run] would update' : 'Updated'} ${updated} file(s) in ${dir}/ to ${version}. Skipped ${skipped}.`);
if (problems.length) { console.log('Problems (unchanged):'); problems.forEach(p => console.log('  - ' + p)); }
