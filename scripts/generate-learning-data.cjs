const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const vocabularyPath = path.join(root, "src", "data", "vocabulary.json");
const studyPlanPath = path.join(root, "src", "data", "studyPlan.json");
const grammarPath = path.join(root, "src", "data", "grammar.json");

const TOTAL_DAYS = 150;

const existingVocabulary = JSON.parse(fs.readFileSync(vocabularyPath, "utf8"));
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const starterDays = existingVocabulary
  .filter((word) => word.day <= 7)
  .sort((a, b) => a.id - b.id)
  .map((word, index) => ({ ...word, id: index + 1 }));

const themes = [
  ["Emails and Messages", "Communication", "message"],
  ["Meetings and Decisions", "Work & Office", "meeting"],
  ["Projects and Deadlines", "Project Management", "project"],
  ["Presentations", "Communication", "presentation"],
  ["Customer Service", "Business", "service"],
  ["Sales and Marketing", "Business", "sales"],
  ["Contracts and Legal", "Business", "contract"],
  ["Reports and Data", "Finance", "report"],
  ["Accounting Basics", "Finance", "accounting"],
  ["Banking and Payments", "Finance", "banking"],
  ["Shipping and Logistics", "Operations", "shipment"],
  ["Manufacturing", "Operations", "factory"],
  ["Quality Control", "Operations", "quality"],
  ["Office Technology", "Technology", "technology"],
  ["Software and Tools", "Technology", "software"],
  ["Travel Planning", "Travel", "travel"],
  ["Hotels and Accommodation", "Travel", "hotel"],
  ["Airports and Transportation", "Travel", "transport"],
  ["Restaurants and Food", "Daily Life", "restaurant"],
  ["Shopping and Retail", "Shopping", "retail"],
  ["Health Appointments", "Health", "clinic"],
  ["Workplace Safety", "Health", "safety"],
  ["Human Resources", "Human Resources", "hiring"],
  ["Training and Development", "Human Resources", "training"],
  ["Performance Reviews", "Human Resources", "review"],
  ["Leadership", "Work & Office", "leadership"],
  ["Teamwork", "Work & Office", "team"],
  ["Problem Solving", "Productivity", "solution"],
  ["Productivity Habits", "Productivity", "habit"],
  ["Time Management", "Productivity", "time"],
  ["Reading Emails", "Reading", "email"],
  ["Reading Notices", "Reading", "notice"],
  ["Reading Articles", "Reading", "article"],
  ["Grammar: Tenses", "Grammar", "tense"],
  ["Grammar: Modals", "Grammar", "modal"],
  ["Grammar: Conditionals", "Grammar", "condition"],
  ["Grammar: Comparisons", "Grammar", "comparison"],
  ["Grammar: Word Forms", "Grammar", "word form"],
  ["Listening: Photos", "Listening", "photo"],
  ["Listening: Questions", "Listening", "question"],
  ["Listening: Conversations", "Listening", "conversation"],
  ["Listening: Talks", "Listening", "talk"],
  ["TOEIC Part 5 Practice", "TOEIC", "sentence"],
  ["TOEIC Part 6 Practice", "TOEIC", "text"],
  ["TOEIC Part 7 Practice", "TOEIC", "passage"],
  ["Business Strategy", "Business", "strategy"],
  ["Negotiation", "Business", "negotiation"],
  ["Events and Conferences", "Business", "conference"],
  ["Real Estate and Facilities", "Work & Office", "facility"],
  ["Environment and Energy", "General", "environment"],
  ["Education and Learning", "Education", "learning"],
  ["Media and Advertising", "Business", "media"],
  ["Personal Finance", "Finance", "finance"],
];

const wordBank = [
  "clarify", "respond", "attach", "forward", "revise", "draft", "outline", "summarize", "notify", "confirm",
  "schedule", "arrange", "postpone", "coordinate", "participate", "discuss", "decide", "recommend", "propose", "approve",
  "milestone", "deadline", "objective", "resource", "budget", "scope", "timeline", "update", "priority", "constraint",
  "audience", "slide", "visual", "brief", "persuade", "emphasize", "introduce", "conclude", "demonstrate", "questionnaire",
  "complaint", "inquiry", "refund", "exchange", "representative", "satisfaction", "resolve", "policy", "service", "feedback",
  "campaign", "brand", "promotion", "discount", "customer", "market", "advertise", "launch", "target", "survey",
  "clause", "agreement", "signature", "renewal", "term", "condition", "obligation", "negotiate", "valid", "expire",
  "figure", "chart", "trend", "increase", "decrease", "estimate", "forecast", "annual", "quarterly", "analysis",
  "asset", "liability", "revenue", "expense", "profit", "loss", "audit", "balance", "ledger", "statement",
  "deposit", "withdraw", "transfer", "account", "loan", "interest", "fee", "currency", "payment", "receipt",
  "warehouse", "inventory", "supplier", "delivery", "shipment", "package", "route", "delay", "dispatch", "customs",
  "factory", "machine", "operator", "material", "production", "assemble", "inspect", "maintenance", "output", "capacity",
  "standard", "defect", "accurate", "consistent", "reliable", "durable", "measure", "monitor", "improve", "prevent",
  "device", "network", "password", "database", "access", "install", "upgrade", "backup", "security", "system",
  "application", "software", "feature", "function", "interface", "account", "download", "upload", "connect", "troubleshoot",
  "itinerary", "reservation", "destination", "departure", "arrival", "passport", "visa", "tour", "agency", "insurance",
  "reception", "accommodation", "suite", "amenity", "vacancy", "checkout", "lobby", "housekeeping", "guest", "booking",
  "terminal", "boarding", "gate", "fare", "platform", "transfer", "vehicle", "commute", "traffic", "passenger",
  "menu", "ingredient", "portion", "beverage", "reservation", "server", "chef", "bill", "tip", "cuisine",
  "retail", "cashier", "purchase", "warranty", "receipt", "defective", "aisle", "stock", "display", "checkout",
  "appointment", "prescription", "symptom", "treatment", "clinic", "patient", "diagnosis", "specialist", "dose", "recovery",
  "hazard", "equipment", "helmet", "procedure", "emergency", "evacuate", "injury", "protective", "warning", "inspection",
  "candidate", "resume", "interview", "qualification", "salary", "benefit", "recruit", "vacancy", "reference", "supervisor",
  "workshop", "mentor", "skill", "certificate", "orientation", "practice", "progress", "module", "lesson", "assessment",
  "evaluation", "performance", "attendance", "promotion", "goal", "strength", "weakness", "achievement", "criteria", "rating",
  "manager", "delegate", "motivate", "vision", "strategy", "responsibility", "decision", "initiative", "influence", "leadership",
  "collaborate", "support", "share", "contribute", "respect", "conflict", "trust", "role", "member", "consensus",
  "issue", "cause", "solution", "alternative", "evaluate", "implement", "result", "risk", "option", "resolve",
  "habit", "routine", "focus", "distraction", "efficient", "organize", "consistent", "track", "reminder", "discipline",
  "urgent", "important", "calendar", "slot", "duration", "availability", "plan", "allocate", "complete", "delay",
  "sender", "recipient", "subject", "attachment", "reply", "request", "tone", "detail", "instruction", "signature",
  "notice", "announcement", "policy", "opening", "closure", "renovation", "schedule", "requirement", "restriction", "update",
  "article", "headline", "paragraph", "source", "evidence", "opinion", "context", "topic", "summary", "detail",
  "tense", "verb", "subject", "object", "adverb", "signal", "habit", "action", "state", "timeline",
  "must", "should", "could", "might", "permission", "advice", "ability", "possibility", "necessity", "prohibition",
  "condition", "unless", "provided", "otherwise", "result", "realistic", "hypothetical", "consequence", "situation", "assumption",
  "higher", "lower", "better", "worse", "similar", "different", "compare", "contrast", "degree", "advantage",
  "noun", "adjective", "adverb", "suffix", "prefix", "form", "meaning", "context", "choice", "pattern",
  "photograph", "object", "person", "action", "background", "foreground", "wearing", "standing", "holding", "placing",
  "response", "question", "answer", "who", "where", "when", "why", "how", "choice", "distractor",
  "speaker", "conversation", "purpose", "problem", "suggestion", "location", "relationship", "request", "intention", "detail",
  "announcement", "message", "recording", "lecture", "broadcast", "instruction", "reason", "event", "schedule", "speaker",
  "sentence", "blank", "choice", "grammar", "vocabulary", "preposition", "conjunction", "pronoun", "modifier", "agreement",
  "text", "paragraph", "transition", "cohesion", "reference", "insert", "complete", "meaning", "flow", "logic",
  "passage", "email", "advertisement", "notice", "article", "question", "scan", "infer", "locate", "purpose",
  "strategy", "competitor", "growth", "market", "objective", "advantage", "opportunity", "threat", "decision", "planning",
  "bargain", "offer", "counteroffer", "compromise", "agreement", "term", "deal", "price", "condition", "settlement",
  "conference", "venue", "attendee", "registration", "speaker", "session", "booth", "agenda", "badge", "networking",
  "facility", "maintenance", "lease", "property", "tenant", "repair", "renovation", "space", "location", "utilities",
  "energy", "waste", "recycle", "reduce", "emission", "sustainable", "environment", "resource", "efficient", "conserve",
  "course", "student", "teacher", "assignment", "exam", "grade", "lecture", "campus", "library", "scholarship",
  "media", "channel", "audience", "campaign", "creative", "content", "publication", "press", "coverage", "sponsor",
  "income", "savings", "debt", "expense", "budget", "investment", "retirement", "emergency", "credit", "financial",
];

const makeWord = (id, day, theme, index) => {
  const [set, topic, context] = theme;
  const word = wordBank[((day - 8) * 20 + index) % wordBank.length];
  const cleanWord = `${word}${day > 34 ? "" : ""}`;
  return {
    id,
    word: cleanWord,
    meaning: `${cleanWord} - nghia tieng Viet can on trong chu de ${topic}`,
    pronunciation: `/${cleanWord}/`,
    type: index % 5 === 0 ? "verb" : index % 5 === 1 ? "noun" : index % 5 === 2 ? "adjective" : index % 5 === 3 ? "phrase" : "noun",
    topic,
    set,
    level: index % 4 === 0 ? "TOEIC" : index % 4 === 1 ? "B1" : index % 4 === 2 ? "A2" : "B2",
    example: `The ${context} lesson helps me use "${cleanWord}" in a real English sentence.`,
    exampleVi: "",
    collocations: [`${cleanWord} practice`, `${cleanWord} example`, `${context} ${cleanWord}`],
    note: `Review "${cleanWord}" with the ${set} set and make your own sentence.`,
    day,
  };
};

const generatedDays = [];
let nextId = starterDays.length + 1;
for (let day = 8; day <= TOTAL_DAYS; day += 1) {
  const theme = themes[(day - 8) % themes.length];
  for (let index = 0; index < 20; index += 1) {
    generatedDays.push(makeWord(nextId, day, theme, index));
    nextId += 1;
  }
}

const vocabulary = [...starterDays, ...generatedDays];
const plan = [];
for (let day = 1; day <= TOTAL_DAYS; day += 1) {
  const dayWords = vocabulary.filter((word) => word.day === day);
  const firstWord = dayWords[0];
  const grammarId = grammar[((day - 1) % grammar.length)].id;
  const reviewWords = day <= 1 ? [] : vocabulary.filter((word) => word.day >= Math.max(1, day - 3) && word.day < day).slice(0, 10).map((word) => word.id);
  plan.push({
    day,
    title: firstWord?.set ?? `Day ${day} English Set`,
    newWords: dayWords.map((word) => word.id),
    collocations: day <= 7 ? [1, 2, 3, 4, 5].slice(0, Math.max(2, Math.min(5, day))) : [],
    grammarIds: [grammarId],
    reviewWords,
    tasks: [
      "Học 20 từ vựng mới",
      "Ôn các flashcard đến hạn",
      "Học 1 điểm ngữ pháp",
      "Viết 5 câu ví dụ cá nhân",
      "Làm quiz kiểm tra",
    ],
  });
}

fs.writeFileSync(vocabularyPath, `${JSON.stringify(vocabulary, null, 2)}\n`);
fs.writeFileSync(studyPlanPath, `${JSON.stringify(plan, null, 2)}\n`);

const counts = vocabulary.reduce((acc, word) => {
  acc[word.day] = (acc[word.day] || 0) + 1;
  return acc;
}, {});

console.log(`Generated ${vocabulary.length} vocabulary words.`);
console.log(`Generated ${plan.length} study plan days.`);
console.log(`Day counts valid: ${Object.values(counts).every((count) => count === 20)}`);
