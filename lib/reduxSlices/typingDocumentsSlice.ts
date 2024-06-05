import { createSlice } from "@reduxjs/toolkit";
import getIndexes from "./getIndexes";
const typingDocumentsSlice = createSlice({
  name: "typingDocuments",

  initialState: {
    documents: [
      {
        attemptStarted: false,
        attemptFinished: false,
        attemptSavedtoDb: false,
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
        wrongCharacters: [
          {
            value: "",
            count: 0,
            userInputs: new Array<string>(),
          },
        ],
        wpm: 0,
        accuracy: 0,
        currentQuoteIndex: 0,
      },
    ],
    currentAttemptNumber: 0,
    nFetchingQuotes: 0,
    nRecievedQuotes: 0,
    triggerSaveResult: false,
  },
  reducers: {
    addQuoteFetchAttempt(state) {
      state.nFetchingQuotes += 1;
    },
    addQuoteReceived(state) {
      state.nRecievedQuotes += 1;
    },
    setAttemptSavedToDb(state) {
      state.documents[state.currentAttemptNumber].attemptSavedtoDb = true;
    },
    setTriggerSaveResult(state, action) {
      if (action.payload.trigger === "on") {
        state.triggerSaveResult = true;
      } else if (action.payload.trigger === "off") {
        state.triggerSaveResult = false;
      }
    },
    addAttempt(state) {
      if (!state.documents[state.documents.length - 1].quotes[0].text) {
        // remove empty attempt first
        state.documents.pop();
      }
      state.documents.push({
        attemptStarted: false,
        attemptFinished: false,
        attemptSavedtoDb: false,
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
        wrongCharacters: [
          {
            value: "",
            count: 0,
            userInputs: [],
          },
        ],
        wpm: 0,
        accuracy: 0,
        currentQuoteIndex: 0,
      });
    },
    shiftNextAttempt(state) {
      state.currentAttemptNumber += 1;
    },
    addQuotes(state, action) {
      if (!state.documents[state.currentAttemptNumber].quotes[0].text) {
        // remove first initial empty quotes
        state.documents[state.currentAttemptNumber].quotes.shift();
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
      const correctAnswer =
        state.documents[state.currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars[currentCharIndex].text.toString();
      const userInput = action.payload.userInput.toString();
      if (userInput === correctAnswer) {
        state.documents[state.currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars[currentCharIndex].typeStatus =
          "correct";
      } else {
        state.documents[state.currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars[currentCharIndex].typeStatus =
          "incorrect";
        // if incorrect, also put it on wrongCharacters object
        // wrongCharacters = [{value = "", count = 0}]
        // wrong char is for <TagCloud/>
        if (
          !state.documents[state.currentAttemptNumber].wrongCharacters[0].value
        ) {
          // replace initial wrongCharacters value
          state.documents[state.currentAttemptNumber].wrongCharacters[0] = {
            value: correctAnswer,
            count: 1,
            userInputs: [userInput],
          };
        } else {
          // find then increase count  or create new wrong char obj
          let alreadyExist = false;
          state.documents[state.currentAttemptNumber].wrongCharacters.forEach(
            (wrongChar) => {
              if (wrongChar.value) {
                if (wrongChar.value === correctAnswer) {
                  alreadyExist = true;
                  wrongChar.count += 1;
                  wrongChar.userInputs.push(userInput);
                }
              }
            }
          );
          if (!alreadyExist) {
            state.documents[state.currentAttemptNumber].wrongCharacters.push({
              value: correctAnswer,
              count: 1,
              userInputs: [userInput],
            });
          }
        }
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

    calculateAccuracy(state) {
      const currentAttemptNumber = state.currentAttemptNumber;

      const totalTypedChar = state.documents[
        currentAttemptNumber
      ].quotes.reduce((sumTotal, quote) => {
        const subTotal = quote.words.reduce((sumSubTotal, word) => {
          if (word.chars[0].typeStatus !== "untyped") {
            return sumSubTotal + word.currentCharIndex;
          } else {
            return sumSubTotal;
          }
        }, 0);
        return sumTotal + subTotal;
      }, 0);

      let typedIncorrectly = 0;
      state.documents[currentAttemptNumber].quotes.map((quote) => {
        quote.words.map((word) => {
          word.chars.map((char) => {
            if (char.typeStatus === "incorrect") {
              typedIncorrectly += 1;
            }
          });
        });
      });

      const accuracy = parseFloat(
        (((totalTypedChar - typedIncorrectly) / totalTypedChar) * 100).toFixed(
          1
        )
      );
      // update accuracy state
      state.documents[state.currentAttemptNumber].accuracy = accuracy;
    },
    increaseWpm(state) {
      state.documents[state.currentAttemptNumber].wpm += 1;
    },

    userStartTyping(state) {
      state.documents[state.currentAttemptNumber].attemptStarted = true;
    },
    userFinishTyping(state) {
      state.documents[state.currentAttemptNumber].attemptFinished = true;
    },
  },
});

export const {
  addQuotes,
  addQuoteFetchAttempt,
  addQuoteReceived,
  setAttemptSavedToDb,
  setTriggerSaveResult,
  addAttempt,
  shiftNextAttempt,
  shiftQuotesIndex,
  shiftWordIndex,
  shiftNextCharIndex,
  shiftPreviousCharIndex,
  typingInputEvaluation,
  removeLastWrongCharacter,
  calculateAccuracy,
  increaseWpm,
  userStartTyping,
  userFinishTyping,
} = typingDocumentsSlice.actions;
export const typingDocumentsReducer = typingDocumentsSlice.reducer;
