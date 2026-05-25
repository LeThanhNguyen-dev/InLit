/**
 * Combines vocabulary batch files into a single vocabulary.json
 * Validates duplicates, types, and schema before writing.
 */
const fs = require('fs');
const path = require('path');

const BATCH_DIR = path.join(__dirname, 'vocab-batches');
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'vocabulary.json');
const VALID_TYPES = ['noun', 'verb', 'adjective', 'adverb', 'phrase'];
const REQUIRED_FIELDS = ['id', 'word', 'baseWord', 'type', 'meaning', 'pronunciation', 'topic', 'frequency', 'level', 'partTags', 'example', 'exampleVi', 'collocations', 'synonyms', 'wordFamily', 'day'];

function validate(entry, index) {
  const errors = [];
  
  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (entry[field] === undefined || entry[field] === null) {
      errors.push(`Missing field: ${field}`);
    }
  }
  
  // Check type validity
  if (!VALID_TYPES.includes(entry.type)) {
    errors.push(`Invalid type: "${entry.type}"`);
  }
  
  // Check arrays
  if (!Array.isArray(entry.partTags)) errors.push('partTags must be array');
  if (!Array.isArray(entry.collocations)) errors.push('collocations must be array');
  if (!Array.isArray(entry.synonyms)) errors.push('synonyms must be array');
  if (!Array.isArray(entry.wordFamily)) errors.push('wordFamily must be array');
  
  // Check collocations count
  if (Array.isArray(entry.collocations) && (entry.collocations.length < 2 || entry.collocations.length > 4)) {
    errors.push(`collocations count: ${entry.collocations.length} (need 2-4)`);
  }
  
  // Check template Vietnamese examples
  if (entry.exampleVi && entry.exampleVi.includes('Cau vi du tieng Viet')) {
    errors.push('Template Vietnamese example detected');
  }
  
  // Check frequency
  if (!['high', 'medium', 'low'].includes(entry.frequency)) {
    errors.push(`Invalid frequency: "${entry.frequency}"`);
  }
  
  // Check level
  if (!['easy', 'medium', 'hard'].includes(entry.level)) {
    errors.push(`Invalid level: "${entry.level}"`);
  }
  
  // Check day range
  if (typeof entry.day !== 'number' || entry.day < 1 || entry.day > 150) {
    errors.push(`Invalid day: ${entry.day}`);
  }
  
  return errors;
}

function main() {
  if (!fs.existsSync(BATCH_DIR)) {
    console.error(`Batch directory not found: ${BATCH_DIR}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(BATCH_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();
  
  console.log(`Found ${files.length} batch files`);
  
  let allEntries = [];
  
  for (const file of files) {
    const filePath = path.join(BATCH_DIR, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`  ${file}: ${data.length} entries`);
      allEntries.push(...data);
    } catch (err) {
      console.error(`  ERROR reading ${file}: ${err.message}`);
    }
  }
  
  console.log(`\nTotal entries loaded: ${allEntries.length}`);
  
  // Sort by day then by word
  allEntries.sort((a, b) => a.day - b.day || a.word.localeCompare(b.word));
  
  // Validate all entries
  let errorCount = 0;
  for (let i = 0; i < allEntries.length; i++) {
    const errors = validate(allEntries[i], i);
    if (errors.length > 0) {
      console.error(`  Entry "${allEntries[i].word}" (day ${allEntries[i].day}): ${errors.join(', ')}`);
      errorCount++;
    }
  }
  
  // Check duplicates
  const seen = new Map();
  const dupes = [];
  for (const entry of allEntries) {
    const key = entry.word.toLowerCase() + '+' + entry.type;
    if (seen.has(key)) {
      dupes.push(key);
    } else {
      seen.set(key, entry);
    }
  }
  
  if (dupes.length > 0) {
    console.error(`\nDuplicates found: ${dupes.length}`);
    dupes.forEach(d => console.error(`  ${d}`));
  }
  
  // Remove duplicates (keep first)
  const deduped = [...seen.values()];
  
  // Check day coverage
  const dayCounts = {};
  for (const entry of deduped) {
    dayCounts[entry.day] = (dayCounts[entry.day] || 0) + 1;
  }
  
  const missingDays = [];
  const wrongCounts = [];
  for (let d = 1; d <= 150; d++) {
    if (!dayCounts[d]) missingDays.push(d);
    else if (dayCounts[d] !== 20) wrongCounts.push(`Day ${d}: ${dayCounts[d]} words`);
  }
  
  if (missingDays.length > 0) {
    console.warn(`\nMissing days: ${missingDays.join(', ')}`);
  }
  if (wrongCounts.length > 0) {
    console.warn(`\nWrong word counts:`);
    wrongCounts.forEach(w => console.warn(`  ${w}`));
  }
  
  // Stats
  const freqDist = { high: 0, medium: 0, low: 0 };
  const topicDist = {};
  const typeDist = {};
  for (const e of deduped) {
    freqDist[e.frequency] = (freqDist[e.frequency] || 0) + 1;
    topicDist[e.topic] = (topicDist[e.topic] || 0) + 1;
    typeDist[e.type] = (typeDist[e.type] || 0) + 1;
  }
  
  console.log(`\n=== STATS ===`);
  console.log(`Total unique entries: ${deduped.length}`);
  console.log(`Validation errors: ${errorCount}`);
  console.log(`Duplicates removed: ${dupes.length}`);
  console.log(`\nFrequency: ${JSON.stringify(freqDist)}`);
  console.log(`Types: ${JSON.stringify(typeDist)}`);
  console.log(`\nTopics:`);
  Object.entries(topicDist).sort((a,b) => b[1] - a[1]).forEach(([t, c]) => console.log(`  ${t}: ${c}`));
  
  // Write output
  fs.writeFileSync(OUTPUT, JSON.stringify(deduped, null, 2), 'utf8');
  console.log(`\nWritten to: ${OUTPUT}`);
  console.log(`File size: ${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB`);
}

main();
