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
    resetQuotes(state, action) {
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
      state.quotes.push({
        text: action.payload.content,
        words: action.payload.content.split(" ").map((word: string) => {
          return {
            text: "",
            currentCharIndex: 0,
            chars: word.split("").map((char: string) => {
              return {
                text: char,
                correctness: null,
              };
            }),
          };
        }),
        currentWordIndex: 0,
        author: action.payload.author.name,
      });
    },
    shiftQuotesIndex(state, action) {
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
    addWrongCharacter(state, action) {
      const currentQuoteIndex = action.payload.currentQuoteIndex;
      const currentWordIndex = action.payload.currentWordIndex;
      const currentCharIndex = action.payload.currentCharIndex;

      state.quotes[currentQuoteIndex].words[currentWordIndex].chars[
        currentCharIndex
      ].typeStatus = "incorrect";
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
  addWrongCharacter,
  removeLastWrongCharacter,
} = typingDocumentsSlice.actions;
export const typingDocumentsReducer = typingDocumentsSlice.reducer;
