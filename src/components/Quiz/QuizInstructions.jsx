import React, { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import CardSection from "../ui/CardSection";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "../../context/QuizContext";

export default function QuizInstructions() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [count, setCount] = useState(3);

  const {
    duration,
    questions_count,
    questions,
    correct_answer_marks,
    negative_marks,
  } = useQuiz();

  console.log(questions);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    setCountdown(true);
    startCountdown();
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(() => {
            navigate("/play/quiz");
          }, 1000);
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl md:max-w-3xl"
      >
        <CardSection className="bg-[#16213e] shadow-xl p-6 sm:p-8 md:p-10 rounded-lg border border-[#00bcd4] overflow-hidden mx-4 md:mx-8">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00bcd4] text-center game-font"
          >
            Quiz Instructions
          </motion.h1>

          <div className="text-white text-base sm:text-lg md:text-xl space-y-3 mt-4">
            <p className="text-center">
              Ensure you read this guide from start to finish.
            </p>
            <ul className="list-none p-0 text-center space-y-2">
              <li>
                The game lasts <strong>{duration} minutes</strong>.
              </li>
              <li>
                Each game has <strong>{questions_count} questions</strong>.
              </li>
              <li>
                Every question contains{" "}
                <strong>{questions[0]?.options?.length} options</strong>.
              </li>
              <li>Select the best answer by clicking on it.</li>
              <li>You can quit anytime, and your score will be shown.</li>
              <li>The timer starts as soon as the game loads.</li>
              <li>
                Correct answer gives you{" "}
                <strong>+{correct_answer_marks} points</strong>.
              </li>
              <li>
                Incorrect answer results in a{" "}
                <strong>-{negative_marks} points</strong> penalty.
              </li>
              <li>Ready to begin?</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 md:mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="flex items-center gap-2 text-[#ff4081] font-medium hover:underline text-center md:text-lg"
              >
                <ArrowBack fontSize="small" /> No, take me back
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00bcd4",
                  "&:hover": {
                    backgroundColor: "#0097a7",
                  },
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "0.3s",
                }}
                onClick={handleClick}
                endIcon={<ArrowForward />}
              >
                Okay, Let’s do this!
              </Button>
            </motion.div>
          </div>
        </CardSection>
      </motion.div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "400px" },
            bgcolor: "#16213e",
            border: "2px solid #00bcd4",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
            outline: "none",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-[#00bcd4] text-center"
          >
            Confirm Start
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            className="text-white text-center"
          >
            Are you sure you want to start the quiz?
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}
          >
            <Button
              onClick={handleClose}
              sx={{
                color: "#ff4081",
                borderColor: "#ff4081",
                "&:hover": {
                  borderColor: "#ff4081",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              sx={{
                backgroundColor: "#00bcd4",
                "&:hover": {
                  backgroundColor: "#0097a7",
                },
              }}
              variant="contained"
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <AnimatePresence>
        {countdown && (
          <Modal
            open={countdown}
            onClose={() => setCountdown(false)}
            aria-labelledby="countdown-modal-title"
            aria-describedby="countdown-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: "80%", md: "400px" },
                bgcolor: "#16213e",
                border: "2px solid #00bcd4",
                boxShadow: 24,
                p: 4,
                borderRadius: "12px",
                outline: "none",
                textAlign: "center",
              }}
            >
              <motion.div
                key={count}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[#00bcd4] text-6xl font-bold"
              >
                {count}
              </motion.div>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
