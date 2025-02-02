import { useEffect, useState } from "react";
import { fetchQuizData } from "./QuizService";

export const useQuizData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState({
    duration: null,
    correct_answer_marks: null,
    negative_marks: null,
    questions_count: null,
    title: null,
    topic: null,
    questions: [],
  });

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const responseData = await fetchQuizData();
        console.log("Fetched Quiz Data:", responseData);

        if (
          responseData &&
          responseData.questions &&
          Array.isArray(responseData.questions)
        ) {
          setQuizData({
            duration: responseData.duration ?? 0,
            negative_marks: Number(responseData.negative_marks) || 0,
            correct_answer_marks:
              Number(responseData.correct_answer_marks) || 1,
            questions_count: responseData.questions_count ?? 0,
            title: responseData.title ?? "Untitled Quiz",
            topic: responseData.topic ?? "Unknown Topic",
            questions: responseData.questions ?? [],
          });
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Error loading quiz data:", err);
        setError(err.message || "Failed to load quiz data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, []);

  return {
    ...quizData,
    isLoading,
    error,
  };
};
