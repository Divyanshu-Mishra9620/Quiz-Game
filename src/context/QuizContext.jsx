import React, { createContext, useContext } from "react";
import { useQuizData } from "../services/loadService";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const quizData = useQuizData();
  return (
    <QuizContext.Provider value={quizData}>{children}</QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
