import React, { useState, useEffect } from "react";
import { useQuiz } from "../../context/QuizContext";
import { useNavigate } from "react-router-dom";
import QuizQuestion from "../Quiz/QuizQuestion";
import QuizStats from "../Quiz/QuizStats";
import Confetti from "react-confetti";
import { ClipLoader } from "react-spinners";

export default function Play() {
  const [showConfetti, setShowConfetti] = useState(false);
  const {
    correct_answer_marks,
    questions_count,
    questions,
    isLoading,
    error,
    negative_marks,
  } = useQuiz();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [timePerQuestion, setTimePerQuestion] = useState([]);
  const [lifelinesUsed, setLifelinesUsed] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());

  const totalMarks = correct_answer_marks * questions_count;

  useEffect(() => {
    if (showResult) return;
    if (timeLeft <= 0) {
      setShowResult(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  useEffect(() => {
    const savedAnswers =
      JSON.parse(localStorage.getItem("selectedAnswers")) || {};
    setSelectedAnswers(savedAnswers);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  const handleAnswer = (questionId, isCorrect, index) => {
    if (selectedAnswers[questionId]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: { selectedOption: index, isCorrect },
    }));

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setScore((prevScore) => prevScore + correct_answer_marks);
    } else {
      setScore((prevScore) => prevScore - negative_marks);
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: questions.find((q) => q.id === questionId),
          selectedOption: index,
        },
      ]);
    }
  };

  const handleNext = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;

    setTimePerQuestion((prev) => {
      const updatedTime = [...prev];
      updatedTime[currentQuestion] = timeTaken;
      return updatedTime;
    });

    setStartTime(Date.now());

    if (currentQuestion + 1 < questions_count) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      setTimeLeft(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResult(false);
    setTimeLeft(15 * 60);
    navigate("/play/instructions", { replace: true });
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
        <ClipLoader size={60} color="#00bcd4" />
      </div>
    );
  }

  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (questions_count === 0) return <div>No quiz data available.</div>;

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] p-4 sm:p-6 md:p-8">
        <Confetti />
        <QuizStats
          totalMarks={totalMarks}
          timePerQuestion={timePerQuestion}
          lifelinesUsed={lifelinesUsed}
          score={score}
          questions={questions}
          wrongAnswers={wrongAnswers}
          selectedAnswers={selectedAnswers}
          onRestartQuiz={handleRestartQuiz}
          onGoHome={handleGoHome}
        />
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <QuizQuestion
        currentQuestion={currentQuestion}
        questions={questions}
        selectedAnswers={selectedAnswers}
        handleAnswer={handleAnswer}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        timeLeft={timeLeft}
        questions_count={questions_count}
        setSelectedAnswers={setSelectedAnswers}
        setLifelinesUsed={setLifelinesUsed}
        lifelinesUsed={lifelinesUsed}
      />
    </>
  );
}
