import { createSlice } from "@reduxjs/toolkit";

const typingDocumentsSlice = createSlice({
  name: "typingDocuments",

  // future
  initialState: {
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
    currentDocumentIndex: 0,
  },
  reducers: {
    resetQuotes(state) {
      state = {
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
        currentDocumentIndex: 0,
      };
    },
    addQuotes(state, action) {
      if (!state.quotes[0].text) {
        // remove first initial empty quotes
        state.quotes.pop();
      }
      state.quotes.push({
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
    shiftQuotesIndex(state) {
      state.currentDocumentIndex += 1;
    },
    shiftWordIndex(state, action) {
      const currentQuoteIndex = action.payload.currentQuoteIndex;
      state.quotes[currentQuoteIndex].currentWordIndex += 1;
    },
    shiftNextCharIndex(state, action) {
      const currentQuoteIndex = action.payload.currentQuoteIndex;
      const currentWordIndex = action.payload.currentWordIndex;

      state.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].currentCharIndex += 1;
    },
    shiftPreviousCharIndex(state, action) {
      const currentQuoteIndex = action.payload.currentQuoteIndex;
      const currentWordIndex = action.payload.currentWordIndex;

      state.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].currentCharIndex -= 1;
    },
    typingInputEvaluation(state, action) {
      const currentQuoteIndex = action.payload.currentQuoteIndex;
      const currentWordIndex = action.payload.currentWordIndex;
      const currentCharIndex = action.payload.currentCharIndex;

      // change userInput value
      state.quotes[currentQuoteIndex].words[currentWordIndex].chars[
        currentCharIndex
      ].userInput = action.payload.userInput;

      // evaluate correctness
      if (
        action.payload.userInput.toString() ===
        state.quotes[currentQuoteIndex].words[currentWordIndex].chars[
          currentCharIndex
        ].text.toString()
      ) {
        state.quotes[currentQuoteIndex].words[currentWordIndex].chars[
          currentCharIndex
        ].typeStatus = "correct";
      } else {
        state.quotes[currentQuoteIndex].words[currentWordIndex].chars[
          currentCharIndex
        ].typeStatus = "incorrect";
      }
    },

    removeLastWrongCharacter(state, action) {
      const currentQuoteIndex = action.payload.currentQuoteIndex;
      const currentWordIndex = action.payload.currentWordIndex;
      const currentCharIndex = action.payload.currentCharIndex;

      state.quotes[currentQuoteIndex].words[currentWordIndex].chars[
        currentCharIndex
      ].typeStatus = "untyped";
    },
  },
});

export const {
  resetQuotes,
  addQuotes,
  shiftNextCharIndex,
  shiftPreviousCharIndex,
  shiftQuotesIndex,
  shiftWordIndex,
  typingInputEvaluation,
  removeLastWrongCharacter,
} = typingDocumentsSlice.actions;
export const typingDocumentsReducer = typingDocumentsSlice.reducer;
