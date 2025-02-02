import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Collapse,
  IconButton,
  Modal,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FilterCenterFocusIcon from "@mui/icons-material/FilterCenterFocus";
import ReplayIcon from "@mui/icons-material/Replay";
import CancelIcon from "@mui/icons-material/Cancel";

export default function QuizQuestion({
  currentQuestion,
  questions,
  selectedAnswers,
  handleAnswer,
  handleNext,
  handlePrevious,
  timeLeft,
  questions_count,
  setSelectedAnswers,
  setLifelinesUsed,
  lifelinesUsed,
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [retryUsed, setRetryUsed] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [showLifelinesModal, setShowLifelinesModal] = useState(false);

  const maxHints = 2;
  const currentQuizItem = questions[currentQuestion];
  const { description, options, detailed_solution, hint } = currentQuizItem;
  const selectedAnswer = selectedAnswers[currentQuizItem.id];
  const isAnswered = !!selectedAnswer;

  const progress = ((currentQuestion + 1) / questions_count) * 100;
  const progressBarAnimation = useSpring({
    width: `${progress}%`,
    from: { width: "0%" },
    config: { tension: 120, friction: 14 },
  });

  const toggleSolution = () => {
    setShowSolution((prev) => !prev);
  };

  const updateLifelineUsage = (type, questionNumber) => {
    setLifelinesUsed((prev) => [...prev, { type, question: questionNumber }]);
  };

  const toggleHint = () => {
    if (hintsUsed < maxHints) {
      setShowHint((prev) => !prev);
      setHintsUsed((prev) => prev + 1);
      updateLifelineUsage("Hint", currentQuestion + 1);
    }
  };

  const useFiftyFifty = () => {
    if (!fiftyFiftyUsed) {
      const incorrectOptions = currentQuizItem.options
        ?.map((option, index) => (option?.is_correct ? null : index))
        .filter((index) => index !== null);

      const optionsToDisable = incorrectOptions?.slice(0, 2);

      setDisabledOptions((prev) => ({
        ...prev,
        [currentQuestion]: optionsToDisable,
      }));

      setFiftyFiftyUsed(true);
      updateLifelineUsage("50-50", currentQuestion);
      setShowLifelinesModal(false);
    }
  };

  const useRetry = () => {
    if (!retryUsed) {
      setSelectedAnswers((prev) => {
        const updatedAnswers = { ...prev };
        delete updatedAnswers[questions[currentQuestion].id];
        return updatedAnswers;
      });
      setRetryUsed(true);
      setShowLifelinesModal(false);
      updateLifelineUsage("Retry", currentQuestion);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e] px-4">
      <Container className="bg-[#16213e] p-6 rounded-lg shadow-xl w-full md:w-[60vw] min-h-[70vh] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <CircularProgress
              variant="determinate"
              value={(timeLeft / (15 * 60)) * 100}
              size={50}
              thickness={5}
              style={{ color: timeLeft <= 60 ? "#ff4081" : "#00bcd4" }}
            />
            <Typography
              variant="h6"
              className="text-[#e0f7fa] font-bold"
              style={{ minWidth: "40px", textAlign: "center" }}
            >
              {formattedTime}
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ filter: "drop-shadow(0 0 10px gold)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              style={{ display: "inline-block" }}
            >
              <IconButton onClick={() => setShowLifelinesModal(true)}>
                <FilterCenterFocusIcon
                  style={{ color: "#ff4081", fontSize: "32px" }}
                />
              </IconButton>
            </motion.div>

            <motion.div
              whileHover={{ filter: "drop-shadow(0 0 10px gold)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              style={{ display: "inline-block" }}
            >
              <IconButton onClick={toggleHint} disabled={hintsUsed >= maxHints}>
                <HelpOutlineIcon
                  style={{
                    color: hintsUsed >= maxHints ? "#666" : "#00bcd4",
                  }}
                />
              </IconButton>
            </motion.div>
          </div>
        </div>

        <div className="relative h-3 bg-[#0f3460] rounded-lg overflow-hidden">
          <animated.div
            className="h-full bg-gradient-to-r from-[#00bcd4] via-[#3b82f6] to-[#ff4081]"
            style={progressBarAnimation}
          />
          <Typography
            variant="body2"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold"
          >
            {Math.round(progress)}%
          </Typography>
        </div>

        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <Typography
              variant="h4"
              className="font-bold text-[#00bcd4] game-font"
              style={{ fontSize: "1.5rem" }}
            >
              {description}
            </Typography>
          </motion.div>
        </div>

        <Modal open={showHint} onClose={toggleHint}>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-[#16213e] p-6 rounded-t-lg shadow-xl"
          >
            <Typography
              variant="h6"
              className="font-bold text-[#00bcd4] text-center"
            >
              Hint
            </Typography>
            <Typography variant="body2" className="text-[#e0f7fa] mt-2">
              {hint}
            </Typography>
          </motion.div>
        </Modal>

        <Modal
          open={showLifelinesModal}
          onClose={() => setShowLifelinesModal(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-[#16213e] p-6 rounded-t-lg shadow-xl"
          >
            <Typography
              variant="h6"
              className="font-bold text-[#00bcd4] text-center"
            >
              Lifelines
            </Typography>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                variant="contained"
                onClick={useFiftyFifty}
                disabled={fiftyFiftyUsed}
                startIcon={<FilterCenterFocusIcon />}
                style={{
                  backgroundColor: fiftyFiftyUsed ? "#666" : "#ff4081",
                  color: "white",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "0.3s",
                }}
              >
                50-50 ({fiftyFiftyUsed ? "Used" : "1 left"})
              </Button>
              <Button
                variant="contained"
                onClick={useRetry}
                disabled={retryUsed}
                startIcon={<ReplayIcon />}
                style={{
                  backgroundColor: retryUsed ? "#666" : "#00bcd4",
                  color: "white",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "0.3s",
                }}
              >
                Retry ({retryUsed ? "Used" : "1 left"})
              </Button>
            </div>
          </motion.div>
        </Modal>

        <div className="flex flex-col gap-3 mt-6">
          {options?.map((option, index) => {
            const isSelected = selectedAnswer?.selectedOption === index;
            const isCorrect = option?.is_correct;
            const isWrongSelected = isSelected && !isCorrect;
            const isDisabled = (
              disabledOptions[currentQuestion] || []
            ).includes(index);

            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    backgroundColor: isSelected
                      ? isCorrect
                        ? "#4ade80"
                        : "#f87171"
                      : isCorrect && isAnswered
                      ? "#4ade80"
                      : "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "0.3s",
                    position: "relative",
                    opacity: isDisabled ? 0.5 : 1,
                    pointerEvents: isDisabled ? "none" : "auto",
                  }}
                  onClick={() =>
                    handleAnswer(currentQuizItem?.id, option?.is_correct, index)
                  }
                  disabled={isAnswered || isDisabled}
                >
                  {option?.description}
                  {isWrongSelected && (
                    <CancelIcon
                      style={{
                        position: "absolute",
                        right: "10px",
                        color: "white",
                        fontSize: "24px",
                      }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div
            whileHover={{ filter: "drop-shadow(0 0 10px gold)" }}
            whileTap={{ scale: 0.98 }}
            style={{ display: "inline-block" }}
          >
            <IconButton onClick={toggleSolution} className="mt-3">
              <InfoIcon style={{ color: "#00bcd4" }} />
            </IconButton>
          </motion.div>
        )}

        <Collapse in={showSolution}>
          <div className="mt-4 p-4 bg-[#0f3460] rounded-lg">
            <Typography variant="h6" className="font-semibold text-[#00bcd4]">
              📝 Detailed Solution
            </Typography>
            <Typography variant="body1" className="text-[#e0f7fa]">
              {detailed_solution}
            </Typography>
          </div>
        </Collapse>

        <div className="flex justify-between items-center mt-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIosNewIcon />}
              onClick={handlePrevious}
              style={{
                backgroundColor: "#ff4081",
                color: "white",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "0.3s",
              }}
            >
              Back
            </Button>
          </motion.div>
          <Typography variant="body1" className="text-[#e0f7fa]">
            {currentQuestion + 1} / {questions_count}
          </Typography>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIosIcon />}
              onClick={handleNext}
              style={{
                backgroundColor: "#00bcd4",
                color: "white",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "0.3s",
              }}
            >
              {currentQuestion + 1 < questions_count ? "Next" : "Finish"}
            </Button>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
