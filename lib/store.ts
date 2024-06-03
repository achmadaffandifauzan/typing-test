// redux in next works differenctly than in react (SPA) (setup only matters in store settings, the rest is same as redux in SPA)
// Per-request safe Redux store creation: A Next.js server can handle multiple requests simultaneously. This means that the Redux store should be created per request and that the store should not be shared across requests.
// SSR-friendly store hydration: Next.js applications are rendered twice, first on the server and again on the client. Failure to render the same page contents on both the client and the server will result in a "hydration error". So the Redux store will have to be initialized on the server and then re-initialized on the client with the same data in order to avoid hydration issues.
// https://redux.js.org/usage/nextjs

import { configureStore } from "@reduxjs/toolkit";
import {
  typingDocumentsReducer,
  resetQuotes,
  addQuotes,
  shiftCurrentAttemptNumber,
  shiftQuotesIndex,
  shiftWordIndex,
  shiftNextCharIndex,
  shiftPreviousCharIndex,
  typingInputEvaluation,
  removeLastWrongCharacter,
  calculateAccuracy,
  increaseWpm,
} from "./reduxSlices/typingDocumentsSlice";

const makeStore = () => {
  return configureStore({
    reducer: { typingDocuments: typingDocumentsReducer },
  });
};

// integrating dispatch functions into one source import, which is here

export {
  makeStore,
  resetQuotes,
  addQuotes,
  shiftCurrentAttemptNumber,
  shiftQuotesIndex,
  shiftWordIndex,
  shiftNextCharIndex,
  shiftPreviousCharIndex,
  typingInputEvaluation,
  removeLastWrongCharacter,
  calculateAccuracy,
  increaseWpm,
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
