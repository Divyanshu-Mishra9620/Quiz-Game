import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";

import Home from "./components/Pages/Home";
import QuizInstructions from "./components/Quiz/QuizInstructions";
import Play from "./components/Pages/Play";

function App() {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play/instructions" element={<QuizInstructions />} />
          <Route path="/play/quiz" element={<Play />} />
        </Routes>
      </Router>
    </QuizProvider>
  );
}

export default App;
