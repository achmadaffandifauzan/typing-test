"use server";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://quotes15.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": process.env.APIKEY1,
    "X-RapidAPI-Host": "quotes15.p.rapidapi.com",
  },
});

let currentNumOfUserRequest = 0;
let fetchingPromise: Promise<void> | null = null;

interface Cache {
  data: any;
  timestamp: number;
  expirationTime: number;
}

const cache: Cache = {
  data: null,
  timestamp: 0,
  expirationTime: 3000, // 3 seconds
};

export const fetchTypingTestData = async (): Promise<any> => {
  currentNumOfUserRequest += 1;

  if (currentNumOfUserRequest === 1) {
    // When many users request simultaneously, only one user x can initiate the API call, other user wait the returned API data initialized by that one user
    fetchingPromise = fetchAndCacheData();
  }

  // Other user wait here (that one user too)
  try {
    // Wait for the fetchingPromise to resolve (API call to complete)
    await fetchingPromise;

    // Return cached data
    return cache.data;
  } catch (error) {
    throw error;
  } finally {
    currentNumOfUserRequest -= 1;
  }
};

const fetchAndCacheData = async (): Promise<void> => {
  const currentTimestamp = Date.now();

  // Check if the cache is still valid
  if (currentTimestamp - cache.timestamp < cache.expirationTime) {
    return;
  }

  try {
    const response = await instance.get("/quotes/random/");

    // Update the cache
    cache.data = response.data;
    cache.timestamp = currentTimestamp;
  } catch (error) {
    console.error(error);
    // Handle errors if necessary
  }
};
