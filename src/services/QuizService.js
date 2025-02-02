import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://api.jsonserve.com/Uw5CrX"
      )}`
    : "/api/Uw5CrX";

export const fetchQuizData = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    if (error.response) {
      console.error("Server response data:", error.response.data);
      console.error("Server response status:", error.response.status);
      console.error("Server response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};
