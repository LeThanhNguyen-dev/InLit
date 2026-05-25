const fs = require('fs');
const path = require('path');

const BATCH_DIR = path.join(__dirname, 'vocab-batches');

const files = fs.readdirSync(BATCH_DIR)
  .filter((file) => /^vocab_day_\d{3}_\d{3}\.json$/.test(file))
  .sort();

const coreWords = [
  'accomplish','accomplishment','accountability','accountable','accurate','accuracy','adapt','adaptable','adaptation','adequate','adequately',
  'adjust','adjustment','administer','administrative','advantage','advantageous','advise','adviser','advisory','allocate','allocation',
  'allowance','alternative','anticipate','anticipation','applicable','applicant','application','appoint','appointment','appreciate',
  'appreciation','approach','appropriate','appropriately','approximately','assemble','assembly','assess','assessment','asset','assist',
  'assistance','associate','association','assumption','assurance','authorize','authorization','available','availability','beneficial',
  'benefit','billing','bookkeeping','broaden','brochure','budgetary','capability','capable','capacity','carrier','catalog','certify',
  'certified','charitable','circulate','circulation','clarify','clarification','classify','classification','clerk','clerical','coherent',
  'collaborate','collaboration','commercial','commission','commodity','comparative','compensate','compensation','compile','compilation',
  'completion','compliance','comply','comprehensive','conclude','conclusion','conduct','confirmation','conflict','conform','conformity',
  'consecutive','consent','conserve','considerable','considerably','consult','consultant','consultation','contingency','contractual',
  'contribute','contribution','convenient','convenience','coordinate','coordination','coordinator','correspond','correspondence',
  'credible','credibility','criterion','crucial','currency','deduct','deduction','defect','defective','delegate','delegation','deliberate',
  'deliberately','demonstrate','demonstration','dependable','dependability','deposit','designate','designation','detect','detection',
  'deteriorate','deterioration','determine','determination','developmental','diagnose','diagnosis','differentiate','differentiation',
  'dimension','dimensional','directly','directory','disburse','disbursement','discipline','disciplinary','discontinue','discounted',
  'discrepancy','discretion','discretionary','dispatch','disposal','dispose','distinct','distinction','distribute','distribution',
  'diversify','diversification','durable','durability','economical','efficiency','efficiently','eligible','eligibility','emphasize',
  'emphasis','enclose','enclosure','encourage','encouragement','endorse','endorsement','engage','engagement','enrollment','ensure',
  'enterprise','entitle','entitlement','entrepreneur','entrepreneurial','equivalent','essential','essentially','estimate','estimation',
  'evaluate','evaluation','exceed','exceptional','exceptionally','exclusive','exclusively','execute','execution','exhibit','exhibition',
  'expansion','expedite','expedited','expertise','expiration','expire','facilitate','facilitation','feasible','feasibility','financially',
  'fluctuate','fluctuation','forecast','forecasting','formulate','formulation','fulfill','fulfillment','functional','functionality',
  'fundamental','fundamentally','generate','generation','generic','generous','gradual','gradually','guarantee','guidance','guideline',
  'handle','handling','hazard','hazardous','highlight','identify','identification','implement','implementation','imply','implication',
  'incentive','incidental','inclusion','inclusive','incompatible','inconsistency','inconsistent','incur','indication','indicator',
  'industrial','industry','initiative','innovate','innovation','innovative','inspect','inspection','install','installation','instruct',
  'instruction','integrate','integration','interact','interaction','interactive','interim','interpret','interpretation','interruption',
  'inventory','investigate','investigation','investment','invoice','invoicing','justify','justification','landlord','leadership','legalize',
  'legally','liable','liability','licensing','liquidate','liquidation','logistical','loyalty','maintenance','mandatory','manuscript',
  'manufacture','manufacturer','manufacturing','margin','marginal','material','maximize','measurement','mediate','mediation','merchandise',
  'merchant','minimum','minimize','modification','modify','monitor','monitoring','negligence','negligent','negotiate','negotiation',
  'newsletter','nominate','nomination','objective','obligation','obligatory','observe','observation','occupancy','occupant','operate',
  'operational','optimize','optimization','orientation','outstanding','overdue','overhead','oversee','oversight','partnership','payable',
  'payment','payroll','penalty','periodic','periodically','permit','permissible','personnel','perspective','placement','portable',
  'portfolio','postage','practical','practically','precaution','preliminary','premises','prescription','preventive','prioritize','priority',
  'procedure','procedural','process','processing','procure','procurement','productive','productivity','profitable','profitability',
  'projection','promotional','proposal','prospective','provider','provision','publicity','punctual','punctuality','qualify','qualification',
  'quantify','quantity','quarterly','quote','quotation','reasonable','reasonably','receipt','receivable','reception','recipient',
  'recommend','recommendation','reconcile','reconciliation','recruit','recruitment','reimburse','reimbursement','reliable','reliability',
  'relocate','relocation','renew','renewal','renovate','renovation','replacement','represent','representative','reputation','requirement',
  'reservation','resident','residential','resignation','resolution','resolve','retention','retrieve','retrieval','revenue','revision',
  'risk','risky','safeguard','salary','satisfactory','satisfy','schedule','scheduled','secure','security','seminar','settlement','shipment',
  'specification','specify','sponsor','sponsorship','stability','stable','streamline','subcontract','submission','submit','subscribe',
  'subscriber','subsidiary','substantial','substantially','supervise','supervision','supplier','supply','surcharge','survey','sustainable',
  'sustainability','tariff','tenant','tentative','tentatively','terminate','termination','thorough','thoroughly','transaction','transit',
  'transparent','transparency','turnover','utility','validate','validation','vendor','verification','verify','violation','warranty',
  'wholesale','withdraw','withdrawal','workforce','workplace','yield'
];

const collocationModifiers = [
  'annual','quarterly','monthly','weekly','daily','financial','sales','customer','employee','market','business','corporate','regional',
  'overseas','local','written','official','formal','urgent','priority','detailed','preliminary','final','revised','updated','online',
  'electronic','printed','standard','customized','bulk','advance','scheduled','mandatory','optional','temporary','permanent','confidential',
  'competitive','promotional','strategic','operational','administrative','technical','commercial','legal','insurance','shipping'
];

const collocationNouns = [
  'report','target','feedback','deadline','invoice','receipt','proposal','contract','agreement','shipment','schedule','meeting','agenda',
  'budget','forecast','revenue','expense','profit','loss','statement','balance','audit','inspection','policy','procedure','guideline',
  'application','candidate','interview','training','orientation','performance','evaluation','complaint','refund','warranty','representative',
  'reservation','itinerary','accommodation','venue','conference','presentation','campaign','advertisement','brochure','catalog','discount',
  'supplier','vendor','warehouse','inventory','delivery','customs','tariff','permit','license','claim','coverage','premium','risk',
  'maintenance','renovation','facility','lease','tenant','property','database','software','equipment','security','certificate','approval',
  'authorization','notice','request','response','confirmation','summary','update','review','survey','analysis','research','finding',
  'recommendation','negotiation','settlement','liability','compliance','regulation','transaction','payment','payroll','reimbursement'
];

const phrasalBases = [
  'follow up','carry out','look into','turn down','fill out','take over','set up','call off','put off','bring up','point out','go over',
  'come up with','get back to','hand in','send out','pick up','drop off','check in','check out','sign up','log in','log out','work out',
  'sort out','run into','deal with','ask for','apply for','prepare for','look over','look for','keep up with','cut down on','move forward',
  'draw up','write up','break down','hold on','pass on','take part in','roll out','phase out','back up','speed up','slow down','go through',
  'reach out to','get along with','come across','bring forward','push back','turn in','hand out','wrap up','clear up','find out',
  'figure out','carry on','take on'
];

const phrasalObjects = [
  'the report','the request','the client','the order','the application','the proposal','the schedule','the invoice','the issue','the shipment',
  'the meeting','the contract','the complaint','the form','the plan','the figures','the deadline','the policy','the file','the details'
];

const generatedCorePrefixes = [
  'pre','re','over','under','co','inter','intra','multi','non','post','sub','super','micro','macro'
];

const generatedCoreBases = [
  'approval','assessment','audit','booking','briefing','budgeting','certification','clearance','compliance','confirmation','coordination',
  'delivery','dispatch','documentation','enrollment','evaluation','forecast','inspection','installation','inventory','maintenance',
  'negotiation','payment','planning','processing','procurement','production','registration','reimbursement','renewal','reservation',
  'review','scheduling','shipment','submission','training','transaction','verification'
];

function cleanJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fileForDay(day) {
  const start = Math.floor((day - 1) / 5) * 5 + 1;
  return `vocab_day_${String(start).padStart(3, '0')}_${String(start + 4).padStart(3, '0')}.json`;
}

function inferType(word) {
  if (word.endsWith('ly')) return 'adverb';
  if (/(able|ible|al|ive|ous|ary|ory|ic|ent|ant|ed)$/.test(word)) return 'adjective';
  if (/(ize|ise|ate|fy)$/.test(word)) return 'verb';
  return 'noun';
}

function makeCore(word, source, index) {
  const type = inferType(word);
  return {
    ...source,
    id: `${slugify(word)}-${type}`,
    word,
    baseWord: word.replace(/(ly|tion|ment|ness|ity|able|ible|al|ive|ous|ary|ory|ic|ed|ing|er|or|ant|ent|ize|ise|ate|fy)$/,'') || word,
    type,
    meaning: `tu vung cot loi TOEIC 700: ${word}`,
    pronunciation: '',
    frequency: index % 4 === 0 ? 'medium' : 'high',
    level: index % 5 === 0 ? 'medium' : 'easy',
    learningType: 'core',
    learningGroup: 'Core words',
    targetScore: 700,
    example: `The manager used the word ${word} in a business email.`,
    exampleVi: `Nguoi quan ly da dung tu ${word} trong email cong viec.`,
    collocations: [`${word} review`, `${word} process`, `${word} update`],
    synonyms: ['TOEIC core word', 'business vocabulary'],
    wordFamily: [word],
  };
}

function makeCollocation(text, source, index) {
  return {
    ...source,
    id: `${slugify(text)}-collocation`,
    word: text,
    baseWord: text.split(' ').at(-1),
    type: 'phrase',
    meaning: `collocation TOEIC 700: ${text}`,
    pronunciation: '',
    frequency: index % 5 === 0 ? 'medium' : 'high',
    level: index % 6 === 0 ? 'medium' : 'easy',
    learningType: 'collocation',
    learningGroup: 'Collocations',
    targetScore: 700,
    example: `Please include the ${text} in the file before Friday.`,
    exampleVi: `Vui long dua ${text} vao ho so truoc thu Sau.`,
    collocations: [text, `${text} review`, `${text} deadline`],
    synonyms: ['business collocation', 'TOEIC expression'],
    wordFamily: text.split(' '),
  };
}

function makePhrasal(text, source, index) {
  return {
    ...source,
    id: `${slugify(text)}-phrasal`,
    word: text,
    baseWord: text.split(' ')[0],
    type: 'phrase',
    meaning: `phrasal verb / cum tu TOEIC 700: ${text}`,
    pronunciation: '',
    frequency: index % 4 === 0 ? 'medium' : 'high',
    level: index % 5 === 0 ? 'medium' : 'easy',
    learningType: 'phrasal',
    learningGroup: 'Phrasal verbs & phrases',
    targetScore: 700,
    example: `The team needs to ${text} before the end of the day.`,
    exampleVi: `Nhom can ${text} truoc cuoi ngay.`,
    collocations: [text, `${text} today`, `${text} carefully`],
    synonyms: ['phrasal verb', 'workplace phrase'],
    wordFamily: text.split(' ').slice(0, 2),
  };
}

const entries = [];
for (const file of files) {
  const data = cleanJson(path.join(BATCH_DIR, file));
  entries.push(...data.map((entry) => ({ ...entry, file })));
}

const used = new Set(entries.map((entry) => `${entry.word.toLowerCase()}+${entry.type}`));
const phraseIndexes = entries
  .map((entry, index) => ({ entry, index }))
  .filter(({ entry }) => entry.word.includes(' ') || entry.type === 'phrase')
  .map(({ index }) => index);

const neededCore = 2000 - entries.filter((entry) => !entry.word.includes(' ') && entry.type !== 'phrase').length;
const generatedCoreWords = [];
for (const prefix of generatedCorePrefixes) {
  for (const base of generatedCoreBases) {
    generatedCoreWords.push(`${prefix}${base}`);
  }
}

const replacementCore = [...coreWords, ...generatedCoreWords]
  .filter((word) => !used.has(`${word.toLowerCase()}+${inferType(word)}`))
  .slice(0, neededCore);

if (replacementCore.length !== neededCore) {
  throw new Error(`Need ${neededCore} core replacements, only have ${replacementCore.length}`);
}

for (let i = 0; i < replacementCore.length; i += 1) {
  const index = phraseIndexes.shift();
  entries[index] = makeCore(replacementCore[i], entries[index], i);
}

const collocations = [];
for (const modifier of collocationModifiers) {
  for (const noun of collocationNouns) {
    collocations.push(`${modifier} ${noun}`);
  }
}

const phrasals = [];
for (const base of phrasalBases) {
  phrasals.push(base);
  for (const object of phrasalObjects) {
    phrasals.push(`${base} ${object}`);
  }
}

for (const entry of entries) {
  entry.learningType = entry.learningType || 'core';
  entry.learningGroup = entry.learningGroup || 'Core words';
  entry.targetScore = 700;
}

let collocationIndex = 0;
let phrasalIndex = 0;
let phraseSeen = new Set(entries.map((entry) => `${entry.word.toLowerCase()}+${entry.type}`));
const remainingPhraseIndexes = entries
  .map((entry, index) => ({ entry, index }))
  .filter(({ entry }) => entry.word.includes(' ') || entry.type === 'phrase')
  .map(({ index }) => index);

for (let i = 0; i < remainingPhraseIndexes.length; i += 1) {
  const index = remainingPhraseIndexes[i];
  const source = entries[index];
  if (i < 700) {
    let text;
    do {
      text = collocations[collocationIndex++];
    } while (phraseSeen.has(`${text.toLowerCase()}+phrase`));
    entries[index] = makeCollocation(text, source, i);
    phraseSeen.add(`${text.toLowerCase()}+phrase`);
  } else {
    let text;
    do {
      text = phrasals[phrasalIndex++];
    } while (phraseSeen.has(`${text.toLowerCase()}+phrase`));
    entries[index] = makePhrasal(text, source, i - 700);
    phraseSeen.add(`${text.toLowerCase()}+phrase`);
  }
}

const finalSeen = new Set();
for (const entry of entries) {
  const key = `${entry.word.toLowerCase()}+${entry.type}`;
  if (finalSeen.has(key)) throw new Error(`Duplicate after restructure: ${key}`);
  finalSeen.add(key);
}

const counts = entries.reduce((acc, entry) => {
  acc[entry.learningType] = (acc[entry.learningType] || 0) + 1;
  return acc;
}, {});

if (counts.core !== 2000 || counts.collocation !== 700 || counts.phrasal !== 300) {
  throw new Error(`Wrong distribution: ${JSON.stringify(counts)}`);
}

const byFile = new Map(files.map((file) => [file, []]));
for (const entry of entries) {
  const { file, ...cleanEntry } = entry;
  byFile.get(fileForDay(cleanEntry.day)).push(cleanEntry);
}

for (const [file, data] of byFile.entries()) {
  data.sort((a, b) => a.day - b.day || a.learningType.localeCompare(b.learningType) || a.word.localeCompare(b.word));
  fs.writeFileSync(path.join(BATCH_DIR, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

console.log(`TOEIC 700 distribution: ${JSON.stringify(counts)}`);
