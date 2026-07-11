import { useState } from "react";
import { BookOpen, FileText, Link2, Search, ChevronDown, ChevronRight } from "lucide-react";

const categories = [
  {
    id: "grammar",
    title: "Grammar Formulas",
    icon: FileText,
    items: [
      {
        title: "Tenses (Thì)",
        rules: [
          { formula: "S + V(s/es)", usage: "Present Simple — thói quen, sự thật", example: "She works at a bank." },
          { formula: "S + is/am/are + V-ing", usage: "Present Continuous — đang xảy ra", example: "They are meeting the client now." },
          { formula: "S + has/have + V3 (pp)", usage: "Present Perfect — đã hoàn thành", example: "I have finished the report." },
          { formula: "S + had + V3 (pp)", usage: "Past Perfect — đã hoàn thành trước quá khứ", example: "She had left before the meeting started." },
          { formula: "S + will + V / S + be going to + V", usage: "Future Simple — dự định tương lai", example: "We will submit the proposal tomorrow." },
        ],
      },
      {
        title: "Conditionals (Điều kiện)",
        rules: [
          { formula: "If + S + V(s/es), S + will + V", usage: "Zero/First Conditional", example: "If you study hard, you will pass." },
          { formula: "If + S + V2/ed, S + would + V", usage: "Second Conditional — giả định trái với hiện tại", example: "If I had time, I would travel more." },
          { formula: "If + S + had + V3, S + would have + V3", usage: "Third Conditional — giả định trái với quá khứ", example: "If I had studied, I would have passed." },
        ],
      },
      {
        title: "Relative Clauses (Mệnh đề quan hệ)",
        rules: [
          { formula: "S + who/whom + V", usage: "who — thay cho người (chủ ngữ)", example: "The employee who submitted the report was promoted." },
          { formula: "S + which/that + V", usage: "which/that — thay cho vật", example: "The project which was completed on time got approval." },
          { formula: "S + whose + N + V", usage: "whose — sở hữu", example: "The manager whose team won the award was praised." },
        ],
      },
      {
        title: "Passive Voice (Bị động)",
        rules: [
          { formula: "S + am/is/are + V3", usage: "Present Simple Passive", example: "The document is reviewed daily." },
          { formula: "S + was/were + V3", usage: "Past Simple Passive", example: "The contract was signed last week." },
          { formula: "S + will be + V3", usage: "Future Passive", example: "The results will be announced next month." },
        ],
      },
    ],
  },
  {
    id: "collocations",
    title: "Common Collocations",
    icon: Link2,
    items: [
      {
        title: "Business Collocations",
        rules: [
          { formula: "make a decision", usage: "Ra quyết định", example: "The board will make a decision by Friday." },
          { formula: "reach an agreement", usage: "Đạt được thỏa thuận", example: "Both parties reached an agreement." },
          { formula: "submit a report", usage: "Nộp báo cáo", example: "Please submit the report by end of day." },
          { formula: "conduct a meeting", usage: "Triển khai cuộc họp", example: "The manager will conduct a meeting at 3 PM." },
          { formula: "raise a concern", usage: "Nêu mối quan ngại", example: "Employees should raise concerns early." },
          { formula: "take responsibility", usage: "Nhận trách nhiệm", example: "She took responsibility for the project." },
          { formula: "give feedback", usage: "Đưa ra phản hồi", example: "Please give feedback on the proposal." },
          { formula: "meet a deadline", usage: "Đúng hạn chót", example: "We need to meet the deadline." },
        ],
      },
      {
        title: "Workplace Collocations",
        rules: [
          { formula: "attend a training", usage: "Tham dự khóa đào tạo", example: "All staff must attend the training." },
          { formula: "apply for a position", usage: "Nộp đơn ứng tuyển", example: "She applied for the manager position." },
          { formula: "comply with regulations", usage: "Tuân thủ quy định", example: "All employees must comply with safety regulations." },
          { formula: "keep in touch", usage: "Giữ liên lạc", example: "Please keep in touch with the client." },
          { formula: "follow up on", usage: "Theo dõi tiếp", example: "I will follow up on the order status." },
        ],
      },
    ],
  },
  {
    id: "phrasal",
    title: "Phrasal Verbs",
    icon: BookOpen,
    items: [
      {
        title: "Common Phrasal Verbs",
        rules: [
          { formula: "carry out", usage: "Thực hiện, triển khai", example: "The team carried out the experiment." },
          { formula: "look into", usage: "Điều tra, tìm hiểu", example: "We will look into the matter." },
          { formula: "set up", usage: "Thiết lập, thành lập", example: "They set up a new department." },
          { formula: "bring up", usage: "Đề cập, nêu ra", example: "She brought up an important point." },
          { formula: "come up with", usage: "Nghĩ ra, đưa ra", example: "He came up with a brilliant idea." },
          { formula: "go over", usage: "Xem xét, ôn lại", example: "Let's go over the contract." },
          { formula: "put off", usage: "Hoãn lại", example: "Don't put off the task until tomorrow." },
          { formula: "turn down", usage: "Từ chối", example: "She turned down the job offer." },
          { formula: "run into", usage: "Gặp tình huống xấu", example: "We ran into some difficulties." },
          { formula: "point out", usage: "Chỉ ra, nhắc nhở", example: "He pointed out the errors in the report." },
        ],
      },
    ],
  },
  {
    id: "vocab",
    title: "TOEIC Vocabulary Patterns",
    icon: Search,
    items: [
      {
        title: "Part 5 — Word Forms",
        rules: [
          { formula: "adj + -ly = adverb", usage: "Nhanh (quick → quickly)", example: "The process was completed quickly." },
          { formula: "verb + -tion/-sion = noun", usage: "Hành động (decide → decision)", example: "The decision was final." },
          { formula: "verb + -ment = noun", usage: "Kết quả (agree → agreement)", example: "Both sides signed the agreement." },
          { formula: "verb + -able/-ible = adjective", usage: "Có thể (access → accessible)", example: "The data is easily accessible." },
          { formula: "noun + -ful = adjective", usage: "Đầy (success → successful)", example: "The project was highly successful." },
          { formula: "noun + -less = adjective", usage: "Không có (help → helpless)", example: "The instructions were helpless." },
        ],
      },
      {
        title: "Part 5 — Prepositions",
        rules: [
          { formula: "responsible for", usage: "Chịu trách nhiệm về", example: "She is responsible for marketing." },
          { formula: "comply with", usage: "Tuân thủ", example: "All staff must comply with policy." },
          { formula: "consist of", usage: "Bao gồm", example: "The team consists of five members." },
          { formula: "result in", usage: "Dẫn đến", example: "The delay resulted in extra costs." },
          { formula: "depend on", usage: "Phụ thuộc vào", example: "Success depends on teamwork." },
          { formula: "apply for", usage: "Nộp đơn", example: "He applied for a transfer." },
        ],
      },
    ],
  },
];

function CategorySection({ category }) {
  const [expanded, setExpanded] = useState(true);
  const Icon = category.icon;

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setExpanded((v) => !v)} className="flex w-full items-center gap-3 p-5 text-left hover:bg-slate-50">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-vault-purple/10 text-vault-purple">
          <Icon size={20} />
        </div>
        <h2 className="flex-1 text-lg font-black text-vault-ink">{category.title}</h2>
        {expanded ? <ChevronDown size={20} className="text-vault-muted" /> : <ChevronRight size={20} className="text-vault-muted" />}
      </button>
      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5">
          {category.items.map((group) => (
            <div key={group.title} className="mt-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-vault-purple">{group.title}</h3>
              <div className="space-y-2">
                {group.rules.map((rule) => (
                  <div key={rule.formula} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <code className="rounded-lg bg-vault-purple/10 px-2 py-1 font-mono text-sm font-bold text-vault-purple">{rule.formula}</code>
                      <span className="text-sm font-semibold text-vault-ink">{rule.usage}</span>
                    </div>
                    <p className="mt-2 text-xs text-vault-muted">Ví dụ: {rule.example}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CheatSheet() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? categories : categories.filter((c) => c.id === filter);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-vault-ink">TOEIC Cheat Sheet</h1>
        <p className="text-vault-muted">Bảng tóm tắt ngữ pháp, collocations và phrasal verbs quan trọng cho TOEIC.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold ${filter === "all" ? "bg-vault-purple text-white" : "bg-white text-vault-ink"}`}>
          Tất cả
        </button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setFilter(c.id)} className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold ${filter === c.id ? "bg-vault-purple text-white" : "bg-white text-vault-ink"}`}>
            {c.title}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
