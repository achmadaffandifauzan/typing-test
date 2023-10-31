import axios from "axios";

const instance = axios.create({
  baseURL: "https://quotes21.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_KEY_RAPIDAPI_QUOTES21,
    "X-RapidAPI-Host": "quotes21.p.rapidapi.com",
  },
});

export const fetchTypingTestData = async () => {
  try {
    const response = await instance.get("/quote");
    return response.data;
  } catch (error) {
    throw error;
  }
};
