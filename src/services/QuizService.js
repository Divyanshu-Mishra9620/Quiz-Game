import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-deployed-proxy.com/api/quiz"
    : "http://localhost:5173/api/quiz";

export const fetchQuizData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    throw error;
  }
};
