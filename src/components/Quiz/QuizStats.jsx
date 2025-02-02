import { useState } from "react";
import { FaQuestionCircle, FaHome, FaRedo } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Button, Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function QuizStats({
  timePerQuestion,
  lifelinesUsed,
  score,
  selectedAnswers,
  questions,
  onRestartQuiz,
  onGoHome,
  totalMarks,
}) {
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const incorrectQuestions = questions.filter(
    (q) => selectedAnswers[q?.id] && !selectedAnswers[q?.id].isCorrect
  );

  const handleIconClick = (questionNumber) => {
    setSelectedQuestion(questionNumber);
  };

  const chartData = timePerQuestion.map((time, index) => ({
    question: `Q${index + 1}`,
    time: time.toFixed(1),
  }));

  return (
    <div className="p-6 bg-[#16213e] rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold text-[#00bcd4] mb-4">Quiz Stats</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Your Score</h3>
        <p className="text-3xl font-bold text-[#00bcd4]">
          {score} / {totalMarks}
        </p>
      </div>

      <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          onClick={() => setShowIncorrect((prev) => !prev)}
          style={{
            marginTop: "10px",
            backgroundColor: "#ff4081",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {showIncorrect
            ? "Hide Incorrect Questions"
            : "Show Incorrect Questions"}
        </Button>
      </motion.div>

      <Collapse in={showIncorrect}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0f3460] p-4 mt-3 rounded-lg"
        >
          {incorrectQuestions.length > 0 ? (
            incorrectQuestions.map((q, index) => (
              <motion.div
                key={q.id}
                className="mb-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Typography variant="h6" className="text-[#00bcd4]">
                  Q{index + 1}: {q.description}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-[#ff5555] font-bold animate-pulse"
                >
                  ❌ Your Answer:{" "}
                  {
                    q.options[selectedAnswers[q.id]?.selectedOption]
                      ?.description
                  }
                </Typography>
                <Typography variant="body2" className="text-[#4ade80]">
                  ✅ Correct Answer:{" "}
                  {q.options.find((opt) => opt.is_correct)?.description}
                </Typography>
              </motion.div>
            ))
          ) : (
            <Typography variant="body2" className="text-[#e0f7fa]">
              🎉 No incorrect answers!
            </Typography>
          )}
        </motion.div>
      </Collapse>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Time Taken Per Question</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="question" stroke="#00bcd4" />
            <YAxis stroke="#00bcd4" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid #00bcd4",
              }}
            />
            <Legend />
            <Bar dataKey="time" fill="#00bcd4" name="Time (seconds)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Lifelines Used</h3>
        {lifelinesUsed.length > 0 ? (
          <ul className="space-y-2">
            {lifelinesUsed.map((lifeline, index) => (
              <li key={index} className="text-lg flex items-center space-x-2">
                <button
                  onClick={() => handleIconClick(lifeline.question)}
                  className="text-[#00bcd4] hover:text-white"
                >
                  <FaQuestionCircle />
                </button>
                <span>
                  Used <strong>{lifeline.type}</strong> on{" "}
                  <strong>Question {lifeline.question}</strong>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg">No lifelines were used.</p>
        )}
      </div>

      {selectedQuestion !== null && (
        <div className="mt-6 p-4 bg-[#1a1a2e] rounded-lg">
          <h4 className="text-xl font-semibold text-[#00bcd4]">
            Question {selectedQuestion}
          </h4>
          <p className="text-lg text-white">
            {questions[selectedQuestion - 1].description}
          </p>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestartQuiz}
          className="flex items-center justify-center gap-2 bg-[#00bcd4] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#0097a7] transition-all duration-300"
        >
          <FaRedo className="text-xl" />
          <span className="text-lg font-semibold">Restart Quiz</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoHome}
          className="flex items-center justify-center gap-2 bg-[#ff4081] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#d81b60] transition-all duration-300"
        >
          <FaHome className="text-xl" />
          <span className="text-lg font-semibold">Go Home</span>
        </motion.button>
      </div>
    </div>
  );
}
