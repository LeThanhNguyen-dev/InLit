const fs = require('fs');
const path = require('path');

const BATCH_DIR = path.join(__dirname, 'vocab-batches');

const files = fs.readdirSync(BATCH_DIR)
  .filter((file) => /^vocab_day_\d{3}_\d{3}\.json$/.test(file))
  .sort();

let entries = [];
let hasError = false;

for (const file of files) {
  const filePath = path.join(BATCH_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
  const perDay = new Map();

  for (const entry of data) {
    perDay.set(entry.day, (perDay.get(entry.day) || 0) + 1);
    entries.push({ ...entry, file });
  }

  const counts = [...perDay.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([day, count]) => `${day}:${count}`)
    .join(' ');

  console.log(`${file}: ${data.length} entries (${counts})`);
  if (data.length !== 100) hasError = true;
}

const seen = new Map();
const duplicates = [];
for (const entry of entries) {
  const key = `${String(entry.word).trim().toLowerCase()}+${entry.type}`;
  if (seen.has(key)) {
    duplicates.push({ key, first: seen.get(key), second: entry.file });
  } else {
    seen.set(key, entry.file);
  }
}

const dayCounts = new Map();
const learningTypeCounts = {};
for (const entry of entries) {
  dayCounts.set(entry.day, (dayCounts.get(entry.day) || 0) + 1);
  if (entry.learningType) {
    learningTypeCounts[entry.learningType] = (learningTypeCounts[entry.learningType] || 0) + 1;
  }
}

const missingDays = [];
const wrongDays = [];
for (let day = 1; day <= 150; day += 1) {
  const count = dayCounts.get(day) || 0;
  if (!count) missingDays.push(day);
  else if (count !== 20) wrongDays.push(`${day}:${count}`);
}

console.log('\nSummary');
console.log(`Files: ${files.length}/30`);
console.log(`Entries: ${entries.length}/3000`);
console.log(`Unique word+type: ${seen.size}/3000`);
console.log(`Duplicates: ${duplicates.length}`);
console.log(`Missing days: ${missingDays.length ? missingDays.join(', ') : 'none'}`);
console.log(`Wrong day counts: ${wrongDays.length ? wrongDays.join(', ') : 'none'}`);
console.log(`Learning types: ${JSON.stringify(learningTypeCounts)}`);

if (duplicates.length) {
  console.log('\nDuplicate samples');
  for (const dup of duplicates.slice(0, 50)) {
    console.log(`${dup.key}: ${dup.first} -> ${dup.second}`);
  }
}

if (
  files.length !== 30 ||
  entries.length !== 3000 ||
  seen.size !== 3000 ||
  missingDays.length ||
  wrongDays.length ||
  learningTypeCounts.core !== 2000 ||
  learningTypeCounts.collocation !== 700 ||
  learningTypeCounts.phrasal !== 300
) {
  hasError = true;
}

process.exit(hasError ? 1 : 0);
