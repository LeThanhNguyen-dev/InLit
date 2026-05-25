const fs = require('fs');
const path = require('path');

const BATCH_DIR = path.join(__dirname, 'vocab-batches');

const topicByStart = new Map([
  [56, 'Hospitality & Dining'],
  [61, 'Events & Conferences'],
  [66, 'Health & Safety'],
  [71, 'Real Estate & Facilities'],
  [116, 'Marketing & Branding'],
  [121, 'Customer Support & Service'],
  [126, 'Accounting & Auditing'],
  [131, 'Legal & Compliance'],
  [136, 'Insurance & Risk'],
  [141, 'Global Trade'],
  [146, 'Advanced Business Communication'],
]);

const topicNouns = {
  Business: ['agenda', 'appointment', 'budget', 'client', 'contract', 'deadline', 'department', 'document', 'estimate', 'feedback', 'invoice', 'meeting', 'notice', 'order', 'policy', 'proposal', 'report', 'schedule', 'supplier', 'update'],
  'Hospitality & Dining': ['reservation', 'accommodation', 'suite', 'banquet', 'caterer', 'buffet', 'concierge', 'housekeeping', 'guestroom', 'amenity', 'voucher', 'menu', 'beverage', 'appetizer', 'entree', 'dessert', 'checkout', 'booking', 'lobby', 'reception'],
  'Events & Conferences': ['seminar', 'workshop', 'symposium', 'webinar', 'venue', 'exhibit', 'booth', 'speaker', 'attendee', 'registration', 'itinerary', 'session', 'badge', 'sponsor', 'panel', 'rehearsal', 'keynote', 'handout', 'agenda', 'reception'],
  'Health & Safety': ['inspection', 'precaution', 'hazard', 'procedure', 'equipment', 'training', 'incident', 'evacuation', 'drill', 'sanitation', 'protective gear', 'warning', 'first aid', 'compliance', 'maintenance', 'ventilation', 'emergency', 'accident', 'guideline', 'workstation'],
  'Real Estate & Facilities': ['lease', 'tenant', 'landlord', 'property', 'facility', 'renovation', 'maintenance', 'premises', 'utilities', 'occupancy', 'blueprint', 'inspection', 'workspace', 'warehouse', 'parking area', 'floor plan', 'security system', 'access card', 'contractor', 'repair'],
  'Marketing & Branding': ['campaign', 'promotion', 'brochure', 'slogan', 'brand', 'market', 'audience', 'advertisement', 'launch', 'survey', 'publicity', 'newsletter', 'catalog', 'display', 'discount', 'segment', 'testimonial', 'logo', 'strategy', 'channel'],
  'Customer Support & Service': ['inquiry', 'complaint', 'refund', 'replacement', 'warranty', 'representative', 'hotline', 'ticket', 'response', 'resolution', 'feedback', 'assistance', 'service desk', 'request', 'callback', 'subscriber', 'client', 'follow-up', 'policy', 'satisfaction'],
  'Accounting & Auditing': ['ledger', 'invoice', 'receipt', 'payroll', 'expense', 'revenue', 'audit', 'balance', 'statement', 'tax', 'asset', 'liability', 'depreciation', 'reimbursement', 'allowance', 'budget', 'forecast', 'transaction', 'bookkeeping', 'account'],
  'Legal & Compliance': ['contract', 'clause', 'agreement', 'regulation', 'policy', 'license', 'permit', 'liability', 'dispute', 'settlement', 'authorization', 'confidentiality', 'obligation', 'amendment', 'violation', 'signature', 'approval', 'notice', 'filing', 'record'],
  'Insurance & Risk': ['premium', 'claim', 'coverage', 'deductible', 'policy', 'beneficiary', 'assessment', 'exposure', 'liability', 'damage', 'protection', 'renewal', 'adjuster', 'incident', 'loss', 'compensation', 'risk', 'exclusion', 'estimate', 'settlement'],
  'Global Trade': ['shipment', 'customs', 'tariff', 'export', 'import', 'container', 'freight', 'manifest', 'declaration', 'broker', 'port', 'supplier', 'distributor', 'cargo', 'invoice', 'duty', 'certificate', 'clearance', 'warehouse', 'destination'],
  'Advanced Business Communication': ['proposal', 'briefing', 'memo', 'correspondence', 'summary', 'clarification', 'recommendation', 'statement', 'announcement', 'minutes', 'attachment', 'revision', 'outline', 'notice', 'presentation', 'update', 'confirmation', 'response', 'instruction', 'request'],
};

const modifiers = [
  'annual', 'quarterly', 'monthly', 'weekly', 'daily', 'updated', 'revised', 'formal', 'written', 'official',
  'internal', 'external', 'regional', 'overseas', 'local', 'corporate', 'commercial', 'priority', 'urgent', 'routine',
  'detailed', 'preliminary', 'final', 'comprehensive', 'mandatory', 'optional', 'confidential', 'electronic', 'printed', 'scheduled',
  'temporary', 'permanent', 'additional', 'available', 'standard', 'customized', 'complimentary', 'advance', 'bulk', 'online',
];

const actions = [
  'review', 'request', 'approval', 'notice', 'update', 'schedule', 'report', 'form', 'record', 'process',
  'procedure', 'policy', 'confirmation', 'arrangement', 'requirement', 'deadline', 'estimate', 'summary', 'checklist', 'guideline',
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fileName(start) {
  return `vocab_day_${String(start).padStart(3, '0')}_${String(start + 4).padStart(3, '0')}.json`;
}

function partTags(index) {
  const sets = [
    ['Part 3', 'Part 5', 'Part 7'],
    ['Part 5', 'Part 6', 'Part 7'],
    ['Part 3', 'Part 4', 'Part 7'],
    ['Part 1', 'Part 3', 'Part 5'],
  ];
  return sets[index % sets.length];
}

function makeEntry(word, topic, day, index) {
  const baseWord = word.split(' ').at(-1);
  return {
    id: `${slugify(word)}-phrase`,
    word,
    baseWord,
    type: 'phrase',
    meaning: `cum tu TOEIC ve ${topic.toLowerCase()}: ${word}`,
    pronunciation: '',
    topic,
    frequency: index % 5 === 0 ? 'medium' : 'high',
    level: index % 7 === 0 ? 'hard' : index % 3 === 0 ? 'medium' : 'easy',
    partTags: partTags(index),
    example: `Please review the ${word} before the next business day.`,
    exampleVi: `Vui long xem lai ${word} truoc ngay lam viec tiep theo.`,
    collocations: [word, `${word} process`, `${word} deadline`],
    synonyms: ['business term', 'workplace expression'],
    wordFamily: [baseWord],
    day,
  };
}

function* candidates(topic) {
  const nouns = topicNouns[topic] || topicNouns.Business;
  for (const noun of nouns) {
    for (const modifier of modifiers) {
      yield `${modifier} ${noun}`;
    }
    for (const action of actions) {
      yield `${noun} ${action}`;
    }
  }
  for (const modifier of modifiers) {
    for (const action of actions) {
      yield `${modifier} ${action}`;
    }
  }
}

function loadBatch(start) {
  const target = path.join(BATCH_DIR, fileName(start));
  if (!fs.existsSync(target)) return [];
  return JSON.parse(fs.readFileSync(target, 'utf8').replace(/^\uFEFF/, ''));
}

const starts = Array.from({ length: 30 }, (_, index) => index * 5 + 1);
const protectedSeen = new Set();
const batches = new Map();

for (const start of starts) {
  const data = loadBatch(start);
  batches.set(start, data);
  for (const entry of data) {
    const key = `${String(entry.word).trim().toLowerCase()}+${entry.type}`;
    if (!protectedSeen.has(key)) {
      protectedSeen.add(key);
    } else {
      entry.__replace = true;
    }
  }
}

for (const start of starts) {
  const original = batches.get(start);
  const topic = topicByStart.get(start) || original[0]?.topic || 'Business';
  const cleaned = original.filter((entry) => !entry.__replace);
  const byDay = new Map();
  for (const entry of cleaned) {
    byDay.set(entry.day, (byDay.get(entry.day) || 0) + 1);
  }

  const made = [];
  let candidateIndex = 0;
  const source = candidates(topic);

  for (let day = start; day <= start + 4; day += 1) {
    while ((byDay.get(day) || 0) < 20) {
      const next = source.next();
      if (next.done) throw new Error(`Not enough candidates for ${topic}`);
      const word = next.value;
      const key = `${word.toLowerCase()}+phrase`;
      if (protectedSeen.has(key)) continue;

      protectedSeen.add(key);
      byDay.set(day, (byDay.get(day) || 0) + 1);
      made.push(makeEntry(word, topic, day, candidateIndex));
      candidateIndex += 1;
    }
  }

  const output = [...cleaned, ...made]
    .filter((entry) => entry.day >= start && entry.day <= start + 4)
    .sort((a, b) => a.day - b.day || a.word.localeCompare(b.word))
    .map(({ __replace, ...entry }) => entry);

  fs.writeFileSync(path.join(BATCH_DIR, fileName(start)), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`${fileName(start)}: ${original.length} -> ${output.length}`);
}
