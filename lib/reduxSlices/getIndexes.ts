export default function getIndexes(state: any) {
  const currentAttemptNumber = state.currentAttemptNumber;
  const currentQuoteIndex =
    state.documents[state.currentAttemptNumber].currentQuoteIndex;
  const currentWordIndex =
    state.documents[state.currentAttemptNumber].quotes[
      state.documents[state.currentAttemptNumber].currentQuoteIndex
    ].currentWordIndex;
  const currentCharIndex =
    state.documents[state.currentAttemptNumber].quotes[
      state.documents[state.currentAttemptNumber].currentQuoteIndex
    ].words[
      state.documents[state.currentAttemptNumber].quotes[
        state.documents[state.currentAttemptNumber].currentQuoteIndex
      ].currentWordIndex
    ].currentCharIndex;
  return {
    currentAttemptNumber,
    currentQuoteIndex,
    currentWordIndex,
    currentCharIndex,
  };
}
