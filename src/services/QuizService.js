import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? `https://cors-anywhere.herokuapp.com/https://api.jsonserve.com/Uw5CrX`
    : "/api/Uw5CrX";

export const fetchQuizData = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    throw error;
  }
};
