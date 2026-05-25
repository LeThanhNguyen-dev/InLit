const DEFAULT_MODEL = "gemini-2.0-flash";

const taskPrompts = {
  today_plan:
    "Hãy biến dữ liệu hôm nay thành kế hoạch học TOEIC 60-90 phút. Ưu tiên ít quyết định, rõ việc cần làm, có thứ tự thời gian.",
  explain_error:
    "Hãy phân tích lỗi sai TOEIC. Chỉ rõ lỗi thuộc vocab, paraphrase, grammar, distractor, keyword, hay listening detail. Đưa cách sửa và bài ôn lại.",
  similar_questions:
    "Hãy tạo 5 câu TOEIC tương tự để luyện lại lỗi này. Mỗi câu có đáp án đúng và giải thích ngắn.",
  analyze_passage:
    "Hãy phân tích passage TOEIC. Trích từ mới, collocation, paraphrase, synonym và bẫy đọc hiểu quan trọng.",
  review_suggestion:
    "Hãy gợi ý review queue thông minh dựa trên từ khó, lỗi sai và phần TOEIC yếu. Chia theo mức ưu tiên.",
  note_to_cards:
    "Hãy biến note học/lỗi sai thành các review cards ngắn. Mỗi card gồm mặt trước, mặt sau, lý do cần ôn.",
};

const buildPrompt = ({ task, context }) => {
  const instruction = taskPrompts[task] ?? taskPrompts.today_plan;
  return [
    "Bạn là EnglishVault AI Coach, gia sư TOEIC cá nhân cho một người Việt đang aim TOEIC 700+ vào tháng 10/2026.",
    "Trả lời bằng tiếng Việt, thực tế, ngắn gọn nhưng đủ sâu. Ưu tiên TOEIC thật: collocation, paraphrase, Part 2/3/4 listening traps, Part 5 grammar, Part 6/7 reading traps.",
    "Không bịa dữ liệu. Nếu thiếu thông tin, hãy nói rõ giả định và đưa cách học tiếp.",
    "",
    `Nhiệm vụ: ${instruction}`,
    "",
    "Dữ liệu người học:",
    String(context ?? "").slice(0, 12000),
  ].join("\n");
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Chỉ hỗ trợ POST." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Thiếu GEMINI_API_KEY. Hãy thêm key vào Environment Variables của Vercel.",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const task = body?.task ?? "today_plan";
    const context = body?.context ?? "";

    if (!context || String(context).trim().length < 10) {
      return res.status(400).json({ error: "Cần thêm dữ liệu học để AI phân tích." });
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildPrompt({ task, context }) }],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 1100,
          },
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini trả về lỗi.",
      });
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!text) {
      return res.status(502).json({ error: "Gemini không trả về nội dung." });
    }

    return res.status(200).json({ text, model, cached: false });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Không gọi được Gemini.",
    });
  }
}
