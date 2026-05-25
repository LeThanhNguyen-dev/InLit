import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StudyPlan from "./pages/StudyPlan.jsx";
import Vocabulary from "./pages/Vocabulary.jsx";
import Collocations from "./pages/Collocations.jsx";
import Grammar from "./pages/Grammar.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import Parts from "./pages/Parts.jsx";
import Quiz from "./pages/Quiz.jsx";
import Reading from "./pages/Reading.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Progress from "./pages/Progress.jsx";
import Notebook from "./pages/Notebook.jsx";

export default function App() {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 px-4 py-5 sm:px-6 lg:ml-72 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/collocations" element={<Collocations />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/notebook" element={<Notebook />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
