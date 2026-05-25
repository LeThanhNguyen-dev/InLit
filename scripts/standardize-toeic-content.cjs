const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '..', 'src', 'data', 'vocabulary.json');
const batchDir = path.join(__dirname, 'vocab-batches');
const grammarPath = path.join(__dirname, '..', 'src', 'data', 'grammar.json');

const toeicTopics = [
  'Office & Administration',
  'Meetings & Scheduling',
  'Business Communication',
  'Human Resources',
  'Recruitment & Jobs',
  'Travel & Transportation',
  'Hotels & Accommodation',
  'Restaurants & Dining',
  'Customer Service',
  'Sales & Retail',
  'Marketing & Advertising',
  'Finance & Banking',
  'Accounting & Auditing',
  'Contracts & Legal',
  'Insurance & Risk',
  'Shipping & Logistics',
  'Manufacturing & Production',
  'Purchasing & Procurement',
  'Technology & IT',
  'Office Equipment',
  'Real Estate & Facilities',
  'Health & Safety',
  'Training & Development',
  'Project Management',
  'Quality & Standards',
  'Research & Reports',
  'Environment & Sustainability',
  'Negotiations & Deals',
  'Global Trade',
  'Business Events',
  'Presentations',
  'Email & Correspondence',
  'Data & Analysis',
  'Product Development',
  'Performance Review',
  'Corporate Policy',
  'Public Relations',
  'Supply Chain',
  'Workplace Issues',
  'Advanced TOEIC Expressions',
];

const grammarLessons = [
  ['Present Simple', 'Thì hiện tại đơn', 'S + V(s/es) + O', 'Thói quen, lịch trình, sự thật trong công việc.'],
  ['Present Continuous', 'Thì hiện tại tiếp diễn', 'S + am/is/are + V-ing', 'Hành động đang diễn ra hoặc kế hoạch gần.'],
  ['Past Simple', 'Thì quá khứ đơn', 'S + V2/ed + O', 'Sự việc đã hoàn tất trong quá khứ.'],
  ['Present Perfect', 'Thì hiện tại hoàn thành', 'S + have/has + V3/ed', 'Kết quả liên quan hiện tại, kinh nghiệm, since/for.'],
  ['Future Forms', 'Các dạng tương lai', 'will / be going to / present continuous', 'Dự đoán, kế hoạch, lịch hẹn.'],
  ['Modal Verbs', 'Động từ khuyết thiếu', 'can / could / may / might / must / should + V', 'Khả năng, đề nghị, nghĩa vụ, lời khuyên.'],
  ['Passive Voice', 'Câu bị động', 'S + be + V3/ed', 'Nhấn mạnh vật/người nhận hành động.'],
  ['Subject-Verb Agreement', 'Hòa hợp chủ ngữ - động từ', 'Singular subject + singular verb', 'Chọn đúng dạng động từ theo chủ ngữ.'],
  ['Gerunds & Infinitives', 'Danh động từ và động từ nguyên mẫu', 'V-ing / to V', 'Dùng sau một số động từ, tính từ, giới từ.'],
  ['Participles', 'Phân từ', 'V-ing / V3/ed as adjective', 'Rút gọn mệnh đề và mô tả danh từ.'],
  ['Relative Clauses', 'Mệnh đề quan hệ', 'who / which / that / where', 'Bổ nghĩa cho người, vật, nơi chốn.'],
  ['Noun Clauses', 'Mệnh đề danh từ', 'that / whether / question word + clause', 'Làm chủ ngữ, tân ngữ, bổ ngữ.'],
  ['Adverb Clauses', 'Mệnh đề trạng ngữ', 'because / although / when / if + clause', 'Chỉ lý do, nhượng bộ, thời gian, điều kiện.'],
  ['Conditionals', 'Câu điều kiện', 'If + clause, main clause', 'Diễn tả điều kiện thật, giả định, kết quả.'],
  ['Comparatives', 'So sánh hơn', 'more/-er + than', 'So sánh hai lựa chọn, sản phẩm, số liệu.'],
  ['Superlatives', 'So sánh nhất', 'the most/-est', 'Nói về mức cao nhất trong nhóm.'],
  ['Articles', 'Mạo từ', 'a / an / the / zero article', 'Xác định danh từ chung, riêng, đã biết.'],
  ['Determiners', 'Từ hạn định', 'some / any / each / every / much / many', 'Xác định số lượng hoặc phạm vi danh từ.'],
  ['Pronouns', 'Đại từ', 'subject / object / possessive / reflexive pronouns', 'Tránh lặp danh từ và chọn đúng vai trò.'],
  ['Prepositions of Time', 'Giới từ thời gian', 'at / on / in / by / until / during', 'Mốc thời gian, hạn chót, khoảng thời gian.'],
  ['Prepositions of Place', 'Giới từ nơi chốn', 'at / in / on / beside / between', 'Vị trí người, vật, nơi làm việc.'],
  ['Prepositional Phrases', 'Cụm giới từ', 'in charge of / according to / due to', 'Cụm cố định thường gặp trong Part 5-7.'],
  ['Conjunctions', 'Liên từ', 'and / but / or / so / yet', 'Nối từ, cụm từ, mệnh đề cùng cấp.'],
  ['Transitions', 'Từ nối logic', 'however / therefore / moreover / meanwhile', 'Liên kết ý trong Part 6 và Part 7.'],
  ['Word Forms', 'Dạng từ', 'noun / verb / adjective / adverb', 'Chọn đúng loại từ theo vị trí trong câu.'],
  ['Prefixes & Suffixes', 'Tiền tố và hậu tố', 're- / pre- / -tion / -ment / -able', 'Đoán nghĩa và loại từ nhanh.'],
  ['Countable & Uncountable Nouns', 'Danh từ đếm được và không đếm được', 'many / much / a few / a little', 'Chọn lượng từ và động từ phù hợp.'],
  ['Quantifiers', 'Lượng từ', 'several / a number of / the amount of', 'Diễn tả số lượng trong văn bản công việc.'],
  ['Causative Verbs', 'Cấu trúc sai khiến', 'have/get/make + object + verb', 'Nhờ, yêu cầu hoặc khiến ai làm gì.'],
  ['Reported Speech', 'Câu tường thuật', 'said that / told someone that', 'Tường thuật thông báo, yêu cầu, lời nói.'],
  ['Requests & Offers', 'Yêu cầu và đề nghị', 'Would you mind / Could you / Let me', 'Giao tiếp công sở lịch sự.'],
  ['Questions', 'Câu hỏi', 'Wh- / Yes-No / tag questions', 'Nhận diện câu hỏi trong Listening và Reading.'],
  ['Negation', 'Phủ định', 'not / never / hardly / neither', 'Tránh hiểu sai nghĩa câu phủ định.'],
  ['Parallel Structure', 'Cấu trúc song song', 'A, B, and C in the same form', 'Giữ các thành phần cùng dạng ngữ pháp.'],
  ['Sentence Fragments', 'Mảnh câu', 'complete subject + complete verb', 'Tránh thiếu chủ ngữ hoặc động từ chính.'],
  ['Run-on Sentences', 'Câu nối sai', 'independent clause + connector + independent clause', 'Tách hoặc nối câu đúng dấu/liên từ.'],
  ['Inversion', 'Đảo ngữ cơ bản', 'Never / Rarely / Not only + auxiliary + subject + verb', 'Cấu trúc nhấn mạnh ở mức nâng cao.'],
  ['Business Email Grammar', 'Ngữ pháp email công việc', 'polite opening + clear request + closing', 'Ứng dụng ngữ pháp vào email TOEIC.'],
];

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
const writeJson = (filePath, data) => fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const vocabulary = readJson(vocabPath).map((entry, index) => ({
  ...entry,
  topic: toeicTopics[index % toeicTopics.length],
  topicGroup: toeicTopics[index % toeicTopics.length],
  targetScore: 700,
}));

writeJson(vocabPath, vocabulary);

const byDayFile = new Map();
for (const entry of vocabulary) {
  const start = Math.floor((entry.day - 1) / 5) * 5 + 1;
  const file = `vocab_day_${String(start).padStart(3, '0')}_${String(start + 4).padStart(3, '0')}.json`;
  if (!byDayFile.has(file)) byDayFile.set(file, []);
  byDayFile.get(file).push(entry);
}

for (const [file, data] of byDayFile.entries()) {
  data.sort((a, b) => a.day - b.day || a.word.localeCompare(b.word));
  writeJson(path.join(batchDir, file), data);
}

const grammar = grammarLessons.map(([title, meaning, structure, usage], index) => ({
  id: index + 1,
  title,
  meaning,
  structure: {
    positive: structure,
    negative: 'Xem ví dụ và lỗi thường gặp trong bài học.',
    question: 'Áp dụng theo ngữ cảnh Part 5-7.',
  },
  usage: [usage, 'Thường xuất hiện trong Part 5, Part 6 và đọc hiểu Part 7.'],
  signals: ['TOEIC', 'Part 5', 'Part 6', 'Part 7'],
  examples: [
    {
      en: `The team reviewed the ${title.toLowerCase()} point during the meeting.`,
      vi: `Nhóm đã xem lại điểm ${meaning.toLowerCase()} trong cuộc họp.`,
    },
  ],
  commonMistakes: [
    'Chọn theo nghĩa tiếng Việt mà bỏ qua vị trí trong câu.',
    'Không kiểm tra chủ ngữ, động từ, hoặc dấu hiệu ngữ pháp xung quanh.',
  ],
  practice: [
    {
      question: `This question tests ${title.toLowerCase()} in a TOEIC-style sentence.`,
      options: ['A', 'B', 'C', 'D'],
      answer: 'A',
      explanation: `Ôn lại cấu trúc: ${structure}.`,
    },
  ],
  day: index + 1,
  level: index < 12 ? 'basic' : index < 28 ? 'intermediate' : 'advanced',
  targetScore: 700,
}));

writeJson(grammarPath, grammar);

console.log(`Vocabulary topics: ${toeicTopics.length}`);
console.log(`Grammar lessons: ${grammar.length}`);
