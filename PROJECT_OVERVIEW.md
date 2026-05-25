# EnglishVault - Tổng quan dự án

EnglishVault là web app học TOEIC cá nhân, chạy hoàn toàn trên máy cá nhân, không backend, không đăng nhập. Mục tiêu chính là giúp bạn học đều từ nay đến kỳ thi TOEIC tháng 10/2026, còn Prep chỉ dùng để làm đề theo Part và mock test.

## Mục tiêu học

- Target: TOEIC 700+
- Thời gian học mỗi ngày: 60-90 phút
- Lộ trình: 150 ngày
- Từ vựng/cụm từ: 3,000 mục
- Nhịp mỗi ngày: 20 từ/cụm TOEIC
- Cách học từ:
  - 12 core words: học kỹ nghĩa, ví dụ, collocation, ghi chú
  - 8 scan words: lướt nhanh, nếu đã biết thì đánh dấu đã học
- Prep:
  - Không dùng Prep để học chính
  - Chỉ dùng Prep để làm Part/mocking
  - Sau khi làm Prep, ghi lỗi sai vào Sổ tay lỗi sai trong EnglishVault

## Daily Study Flow

Mỗi ngày nên đi theo flow này:

1. Ôn review queue và từ khó: 10 phút
2. Scan 20 từ/cụm TOEIC hôm nay: 25 phút
3. Học kỹ 12 core words chưa chắc: 15 phút
4. Học 1 điểm ngữ pháp hoặc collocation: 15 phút
5. Làm set Part trên Prep theo focus hôm nay: 15-25 phút
6. Ghi lỗi sai vào Sổ tay lỗi sai: 10 phút

Tổng thời gian: khoảng 60-90 phút/ngày.

## Lộ trình TOEIC 700+

Lộ trình nằm trong `src/data/targetRoadmap.json`.

### Giai đoạn 1: Xây nền từ số 0

- Ngày: 1-21
- Mốc điểm: 0-250
- Focus: câu cơ bản, từ vựng công sở/du lịch/kinh doanh
- Listening: Part 1 chậm, Part 2 dạng câu hỏi ngắn
- Reading: thông báo ngắn, email ngắn, câu đơn
- Grammar: hiện tại đơn, hiện tại tiếp diễn, quá khứ đơn, tương lai, so sánh

### Giai đoạn 2: Nền TOEIC cốt lõi

- Ngày: 22-50
- Mốc điểm: 250-400
- Focus: phản xạ Part 2, tốc độ Part 5
- Listening: Part 2 hằng ngày, bắt đầu Part 3 ngắn
- Reading: Part 5, Part 6 ngắn
- Grammar: modal verbs, mạo từ, giới từ, word form, hòa hợp chủ-vị

### Giai đoạn 3: Tăng tốc trung cấp

- Ngày: 51-85
- Mốc điểm: 400-550
- Focus: tăng tốc Part 3, 4, 5, 6, 7
- Listening: dự đoán chủ đề, mục đích người nói, bắt chi tiết
- Reading: Part 6 liên kết câu, Part 7 scan thông tin
- Grammar: câu điều kiện, bị động, mệnh đề quan hệ, liên từ

### Giai đoạn 4: Đẩy lên mốc 600

- Ngày: 86-120
- Mốc điểm: 550-650
- Focus: luyện có bấm giờ, sửa Part yếu, collocation TOEIC
- Listening: Part 3/4 có giới hạn thời gian, review transcript
- Reading: Part 5/6/7 có bấm giờ, phân tích bẫy
- Grammar: word form nâng cao, rút gọn mệnh đề, bẫy so sánh, nhất quán thì

### Giai đoạn 5: Nước rút 700+

- Ngày: 121-150
- Mốc điểm: 650-700+
- Focus: sức bền làm đề, dọn review queue, chiến thuật phòng thi
- Listening: full Listening, shadow đoạn khó, review keyword bị bỏ lỡ
- Reading: full Reading, phân bổ thời gian, double/triple passage
- Grammar: chỉ sửa lỗi lặp lại trong notebook/quiz

## Các trang trong app

### Tổng quan

File: `src/pages/Dashboard.jsx`

Hiển thị:

- Lời chào cá nhân
- Kế hoạch hôm nay
- 20 từ/cụm hôm nay
- Chia core/scan
- Grammar hôm nay
- Collocation hôm nay nếu có
- Review queue
- Chuỗi ngày học
- Tiến độ tổng
- Tiến độ theo Part
- Weekly chart

### Lộ trình

File: `src/pages/Roadmap.jsx`

Hiển thị:

- Roadmap TOEIC 700+
- Các phase học
- Tài liệu theo phase
- Cách dùng Prep
- Nhịp học mỗi tuần

### Kế hoạch ngày

File: `src/pages/StudyPlan.jsx`

Hiển thị 150 ngày học:

- Ngày học
- Tên bộ học
- 20 từ mới
- 12 core + 8 scan
- Từ ôn lại
- Grammar tương ứng
- Focus skill
- Prep Part cần làm
- Nút đánh dấu hoàn thành ngày

### Từ vựng

File: `src/pages/Vocabulary.jsx`

Tính năng:

- Xem toàn bộ từ/cụm
- Search theo từ/nghĩa/ví dụ
- Filter theo topic, level, day
- Đánh dấu đã học
- Đánh dấu từ khó

### Cụm từ

File: `src/pages/Collocations.jsx`

Tính năng:

- Xem collocation
- Lọc theo topic/day
- Đánh dấu đã học

### Ngữ pháp

File: `src/pages/Grammar.jsx`

Tính năng:

- Xem bài ngữ pháp
- Cấu trúc câu
- Cách dùng
- Dấu hiệu nhận biết
- Ví dụ
- Lỗi sai thường gặp
- Practice question
- Đánh dấu hoàn thành bài

### Flashcard

File: `src/pages/Flashcards.jsx`

Tính năng:

- Chọn ngày học
- Mode:
  - Theo ngày
  - Cần ôn
  - Từ khó
  - Đã học
  - Tất cả
- Lật thẻ
- Đánh dấu đã học
- Đánh dấu từ khó
- Spaced repetition:
  - Học lại
  - Khó
  - Ổn
  - Dễ

### Quiz

File: `src/pages/Quiz.jsx`

Tính năng:

- Generate quiz từ vocabulary và grammar practice
- Chọn đáp án
- Nộp bài
- Xem điểm
- Lưu điểm vào localStorage

### Đọc hiểu

File: `src/pages/Reading.jsx`

Tính năng:

- Đọc passage ngắn
- Xem vocabulary trong passage
- Đánh dấu đã đọc

### Các Part

File: `src/pages/Parts.jsx`

Tính năng:

- Theo dõi TOEIC Part 1-7 riêng
- Log 10 phút luyện
- Xem số buổi, số phút, phần trăm theo từng Part
- Chọn focus Part trong hồ sơ cá nhân

### Tiến độ

File: `src/pages/Progress.jsx`

Hiển thị:

- Từ đã học
- Từ khó
- Bài ngữ pháp đã hoàn thành
- Ngày đã hoàn thành
- Quiz đã làm
- Từ cần ôn
- Tiến độ theo Part
- Weekly chart
- Export backup dữ liệu localStorage

### Sổ tay lỗi sai

File: `src/pages/Notebook.jsx`

Tính năng:

- Ghi note từ vựng
- Ghi note ngữ pháp
- Ghi lỗi Prep
- Ghi câu sửa đúng
- Lưu note vào localStorage
- Xóa note

## Data files

### `src/data/vocabulary.json`

Hiện có:

- 3,000 mục từ/cụm
- 150 ngày
- 20 mục/ngày
- Mỗi mục có:
  - `id`
  - `word`
  - `meaning`
  - `pronunciation`
  - `type`
  - `topic`
  - `set`
  - `level`
  - `example`
  - `exampleVi`
  - `collocations`
  - `note`
  - `day`

Lưu ý: bộ này đã được chỉnh theo TOEIC theme và có nghĩa Việt cơ bản. Để đạt mức giáo trình riêng thật sự, nên tiếp tục curate sâu hơn: ví dụ Việt, bẫy TOEIC, word family, synonym, transcript keyword.

### `src/data/studyPlan.json`

Hiện có:

- 150 ngày
- Mỗi ngày:
  - `day`
  - `title`
  - `phase`
  - `focusSkill`
  - `prepPractice`
  - `estimatedMinutes`
  - `newWords`
  - `coreWords`
  - `scanWords`
  - `grammarIds`
  - `reviewWords`
  - `tasks`

### `src/data/targetRoadmap.json`

Chứa:

- Target score
- Exam month
- Start date
- Total days
- Vocabulary target
- Weekly routine
- 5 phases

### `src/data/materials.json`

Chứa tài liệu theo phase:

- EnglishVault pages
- British Council Grammar
- Cambridge English Learning English
- ETS TOEIC official reference
- Prep practice workflow

### `src/data/grammar.json`

Hiện có 6 bài ngữ pháp mẫu.

Nên mở rộng thêm:

- Articles
- Prepositions
- Word forms
- Passive voice
- Relative clauses
- Conditionals
- Conjunctions
- Reduced clauses
- Gerund/infinitive
- Subject-verb agreement

### `src/data/collocations.json`

Hiện có 20 collocations mẫu.

Nên mở rộng thêm:

- 300-500 collocations TOEIC tần suất cao
- Gắn collocations vào topic và Part

### `src/data/readings.json`

Hiện có 3 passage mẫu.

Nên mở rộng thêm:

- Email
- Notice
- Advertisement
- Article
- Memo
- Schedule
- Double passage
- Triple passage

## localStorage keys

App lưu dữ liệu học bằng localStorage:

- `englishvault_learned_words`
- `englishvault_difficult_words`
- `englishvault_completed_grammar`
- `englishvault_completed_days`
- `englishvault_quiz_scores`
- `englishvault_notes`
- `englishvault_streak`
- `englishvault_learned_collocations`
- `englishvault_completed_readings`
- `englishvault_profile`
- `englishvault_part_progress`
- `englishvault_word_reviews`

## Utility files

### `src/utils/storage.js`

Quản lý:

- đọc/ghi localStorage
- toggle learned/difficult
- lưu quiz score
- streak
- profile
- part practice
- spaced repetition review
- export backup

### `src/utils/progress.js`

Quản lý:

- ngày học hiện tại
- phase hiện tại
- snapshot tiến độ
- weekly chart data

### `src/utils/quiz.js`

Sinh quiz từ:

- vocabulary
- grammar practice

### `src/utils/spacedRepetition.js`

Lọc flashcard theo:

- ngày
- từ khó
- đã học
- cần ôn
- tất cả

## Scripts hỗ trợ data

### `scripts/generate-learning-data.cjs`

Sinh dữ liệu học nhiều ngày từ word bank.

### `scripts/apply-vietnamese-glosses.cjs`

Gán nghĩa tiếng Việt cơ bản cho word bank.

### `scripts/apply-vietnamese-set-names.cjs`

Việt hóa tên bộ học.

### `scripts/create-toeic-700-plan.cjs`

Tạo plan chính hiện tại:

- 150 ngày
- 20 từ/cụm/ngày
- 12 core words
- 8 scan words
- 60-90 phút/ngày
- Prep practice theo phase

## Tech stack

- React
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React icons
- Recharts
- localStorage
- JSON data files

## Cách chạy

```bash
npm install
npm run dev
```

App chạy ở:

```text
http://127.0.0.1:5173
```

Build production:

```bash
npm run build
```

## AI Coach với Gemini

App đã có trang `AI Coach` tại route `/ai-coach`.

Tính năng:

- Giải thích lỗi sai TOEIC từ Prep/ETS
- Tạo câu hỏi tương tự để luyện lại lỗi vừa sai
- Phân tích reading passage: vocab, collocation, paraphrase, synonym, bẫy đọc hiểu
- Gợi ý review queue dựa trên từ khó, lỗi sai, Part yếu
- Biến note/lỗi sai thành review cards
- Cache kết quả vào `englishvault_ai_cache` trong localStorage để giảm số lần gọi API

Cách gọi API:

```text
React app
  -> /api/gemini
  -> Gemini API
```

Không được gọi Gemini trực tiếp từ React vì sẽ lộ API key. Key phải nằm trong biến môi trường:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

Khi deploy Vercel:

1. Vào Project Settings
2. Chọn Environment Variables
3. Thêm `GEMINI_API_KEY`
4. Có thể thêm `GEMINI_MODEL`
5. Deploy lại app

Lưu ý local:

- `npm run dev` chỉ chạy Vite UI.
- Serverless route `/api/gemini` chạy đúng trên Vercel hoặc khi dùng `vercel dev`.
- Không để API key trong source code, commit, JSON data, hay component React.
- Nếu đã từng dán key vào chat hoặc public chỗ nào, nên revoke/rotate key đó.

## Điểm đã ổn

- Có roadmap TOEIC 700+ rõ ràng đến tháng 10
- Có daily plan thực tế cho 60-90 phút/ngày
- Có cơ chế 20 từ/ngày nhưng chia core/scan hợp lý
- Có flashcard + spaced repetition
- Có tracking từ khó, từ đã học, ngày hoàn thành
- Có tracking từng Part
- Có notebook để ghi lỗi Prep
- Không cần backend
- Có export backup

## Điểm chưa hoàn chỉnh nên làm tiếp

1. Curate lại vocabulary ở mức cao hơn
   - loại trùng lặp không cần thiết
   - thêm frequency TOEIC
   - thêm Part tag
   - thêm ví dụ TOEIC tự nhiên hơn
   - thêm word family
   - thêm synonym/paraphrase
   - thêm bẫy thường gặp

2. Mở rộng grammar
   - ít nhất 30-50 bài nhỏ
   - nhiều practice question hơn
   - gắn grammar với Part 5/6

3. Mở rộng collocation
   - 300-500 collocations TOEIC
   - gắn vào topic và part

4. Mở rộng reading
   - email, notice, article, ad, memo, schedule
   - thêm câu hỏi đọc hiểu
   - thêm vocabulary extraction

5. Thêm Error Log riêng
   - Part
   - câu sai
   - lý do sai
   - dạng bẫy
   - ngày cần ôn lại

6. Thêm import backup
   - hiện đã có export backup
   - nên thêm import để khôi phục dữ liệu

7. Tối ưu bundle
   - vì vocabulary JSON lớn nên build warning chunk size
   - có thể tách data theo day hoặc lazy load

## Cách dùng đề Prep với EnglishVault

Prep chỉ nên dùng sau khi học trong EnglishVault.

Flow chuẩn:

1. Học từ/cụm/ngữ pháp trong EnglishVault
2. Làm set Part trên Prep theo focus ngày đó
3. Không chỉ xem điểm, phải lấy lỗi sai về EnglishVault
4. Ghi lỗi vào Sổ tay lỗi sai:
   - câu sai
   - đáp án đã chọn
   - đáp án đúng
   - vì sao sai
   - từ/cụm/grammar cần ôn
5. Mark từ hoặc grammar đó là khó
6. Ôn lại trong review queue

## Kết luận

EnglishVault hiện đã đủ làm hệ thống học cá nhân cho TOEIC 700+:

- học mỗi ngày
- ôn lại
- làm Prep có chủ đích
- ghi lỗi
- theo dõi tiến độ

Nhưng để thành bản thật sự chất lượng cao cho thi TOEIC, bước quan trọng tiếp theo là curate sâu dữ liệu học: vocabulary, collocation, grammar và reading.
