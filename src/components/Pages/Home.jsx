import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import InfoIcon from "@mui/icons-material/Info";
import { motion } from "framer-motion";
import { useQuiz } from "../../context/QuizContext";
import CardSection from "../ui/CardSection";
import "./Home.css";

export default function Home() {
  const { duration, title, topic, isLoading } = useQuiz();
  const [isOptionMarked, setIsOptionMarked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => navigate("/play/instructions");

  const handleMarkOption = () => {
    setIsOptionMarked(true);
    setTimeout(() => setIsOptionMarked(false), 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e] p-4 sm:p-6 md:p-8">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <ClipLoader color="#00bcd4" size={50} />
          <p className="mt-4 text-[#e0f7fa] font-semibold">Loading quiz...</p>
        </div>
      ) : (
        <CardSection className="bg-[#16213e] shadow-xl p-6 sm:p-8 md:p-10 rounded-lg border border-[#00bcd4] w-full max-w-xl md:max-w-2xl">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <QuizIcon sx={{ fontSize: 100, color: "#00bcd4" }} />
          </motion.div>

          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-[#e0f7fa]">
              Duration: <span className="text-[#00bcd4]">{duration} min</span>
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-[#00bcd4] game-font">
              {title}
            </h1>
            <p className="font-bold text-lg text-[#e0f7fa]">{topic}</p>
          </div>

          <div className="mt-8 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00bcd4",
                  "&:hover": { backgroundColor: "#0097a7" },
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "0.3s",
                }}
                onClick={handleClick}
              >
                Start Quiz
              </Button>
            </motion.div>
          </div>

          <div className="flex justify-center mt-8">
            <motion.div
              animate={{
                scale: isOptionMarked ? 1.2 : 1,
                boxShadow: isOptionMarked
                  ? "0 0 20px 5px rgba(255, 215, 0, 0.8)"
                  : "none",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <InfoIcon
                sx={{ fontSize: 40, color: "#00bcd4", cursor: "pointer" }}
              />
            </motion.div>
          </div>

          <div className="flex justify-center mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                sx={{
                  color: "#00bcd4",
                  borderColor: "#00bcd4",
                  "&:hover": { borderColor: "#0097a7" },
                  padding: "8px 16px",
                }}
                onClick={handleMarkOption}
              >
                Mark Option (Demo)
              </Button>
            </motion.div>
          </div>
        </CardSection>
      )}
    </div>
  );
}
