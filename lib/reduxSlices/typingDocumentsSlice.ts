import { createSlice } from "@reduxjs/toolkit";
import getIndexes from "./getIndexes";
const typingDocumentsSlice = createSlice({
  name: "typingDocuments",

  initialState: {
    documents: [
      {
        attemptNumber: 0,
        attemptStarted: false,
        attemptFinished: false,
        quotes: [
          {
            text: "",
            words: [
              {
                text: "",
                currentCharIndex: 0,
                chars: [
                  {
                    text: "",
                    typeStatus: "untyped",
                    userInput: "untyped",
                  },
                ],
              },
            ],
            currentWordIndex: 0,
            author: "",
          },
        ],
        wpm: 0,
        accuracy: 0,
        currentQuoteIndex: 0,
      },
    ],
    currentAttemptNumber: 0,
  },
  reducers: {
    resetQuotes(state) {
      state.documents[0] = {
        attemptNumber: 0,
        attemptStarted: false,
        attemptFinished: false,
        quotes: [
          {
            text: "",
            words: [
              {
                text: "",
                currentCharIndex: 0,
                chars: [
                  {
                    text: "",
                    typeStatus: "untyped",
                    userInput: "untyped",
                  },
                ],
              },
            ],
            currentWordIndex: 0,
            author: "",
          },
        ],
        wpm: 0,
        accuracy: 0,
        currentQuoteIndex: 0,
      };
    },
    addQuotes(state, action) {
      if (!state.documents[state.currentAttemptNumber].quotes[0].text) {
        // remove first initial empty quotes
        state.documents[state.currentAttemptNumber].quotes.pop();
      }
      state.documents[state.currentAttemptNumber].quotes.push({
        text: action.payload.content,
        words: action.payload.content.split(" ").map((word: string) => {
          return {
            text: word,
            currentCharIndex: 0,
            chars: word.split("").map((char: string) => {
              return {
                text: char,
                typeStatus: "untyped",
                userInput: "untyped",
              };
            }),
          };
        }),
        currentWordIndex: 0,
        author: action.payload.author,
      });
    },
    shiftCurrentAttemptNumber(state) {
      state.currentAttemptNumber += 1;
    },
    shiftQuotesIndex(state) {
      state.documents[state.currentAttemptNumber].currentQuoteIndex += 1;
    },
    shiftWordIndex(state) {
      const { currentQuoteIndex } = getIndexes(state);

      state.documents[state.currentAttemptNumber].quotes[
        currentQuoteIndex
      ].currentWordIndex += 1;
    },
    shiftNextCharIndex(state) {
      const { currentQuoteIndex, currentWordIndex } = getIndexes(state);

      state.documents[state.currentAttemptNumber].quotes[
        currentQuoteIndex
      ].words[currentWordIndex].currentCharIndex += 1;
    },
    shiftPreviousCharIndex(state) {
      const { currentQuoteIndex, currentWordIndex } = getIndexes(state);

      state.documents[state.currentAttemptNumber].quotes[
        currentQuoteIndex
      ].words[currentWordIndex].currentCharIndex -= 1;
    },
    typingInputEvaluation(state, action) {
      const { currentQuoteIndex, currentWordIndex, currentCharIndex } =
        getIndexes(state);

      // change userInput value
      state.documents[state.currentAttemptNumber].quotes[
        currentQuoteIndex
      ].words[currentWordIndex].chars[currentCharIndex].userInput =
        action.payload.userInput;

      // evaluate correctness
      if (
        action.payload.userInput.toString() ===
        state.documents[state.currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars[currentCharIndex].text.toString()
      ) {
        state.documents[state.currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars[currentCharIndex].typeStatus =
          "correct";
      } else {
        state.documents[state.currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars[currentCharIndex].typeStatus =
          "incorrect";
      }
    },

    removeLastWrongCharacter(state) {
      const { currentQuoteIndex, currentWordIndex, currentCharIndex } =
        getIndexes(state);
      const previousCharIndex = currentCharIndex - 1; // get the previousIndex

      state.documents[state.currentAttemptNumber].quotes[
        currentQuoteIndex
      ].words[currentWordIndex].chars[previousCharIndex].typeStatus = "untyped";
    },

    updateWpm(state, action) {
      state.documents[state.currentAttemptNumber].wpm = action.payload.wpm;
    },
    calculateWpm(state, action) {},
    updateAccuracy(state, action) {
      state.documents[state.currentAttemptNumber].wpm = action.payload.accuracy;
    },
  },
});

export const {
  resetQuotes,
  addQuotes,
  shiftCurrentAttemptNumber,
  shiftQuotesIndex,
  shiftWordIndex,
  shiftNextCharIndex,
  shiftPreviousCharIndex,
  typingInputEvaluation,
  removeLastWrongCharacter,
  updateWpm,
  updateAccuracy,
} = typingDocumentsSlice.actions;
export const typingDocumentsReducer = typingDocumentsSlice.reducer;
