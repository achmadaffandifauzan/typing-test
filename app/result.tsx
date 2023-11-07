import { DocumentsSchema, PreviousScore } from "./page";
import { useEffect } from "react";
interface ResultScoreProps {
  documents: DocumentsSchema;
  isTimerRunning: boolean;
  previousScore: PreviousScore;
  setPreviousScore: React.Dispatch<React.SetStateAction<PreviousScore>>;
  isFinished: boolean;
}
const ResultScore = ({
  documents,
  isTimerRunning,
  previousScore,
  setPreviousScore,
  isFinished,
}: ResultScoreProps) => {
  const wrongAnswers = documents.quotes
    .map((quoteObj) => {
      return quoteObj.words
        .map((wordObj) => {
          return wordObj.wrongCharacters;
        })
        .flat();
    })
    .flat();
  let totalTypedChars = 0;
  let totalTypedWords = 0;
  for (let quoteObj of documents.quotes) {
    if (quoteObj.currentWordIndex !== 0) {
      totalTypedWords += quoteObj.currentWordIndex;
    }
    for (let wordObj of quoteObj.words) {
      if (wordObj.currentCharIndex !== 0 && wordObj.chars.length !== 1) {
        // check if user already typing it, since some word is just 1 characters, and since all words (typed and not yet typed) have currentCharIndex of 0 by default
        totalTypedChars += wordObj.chars.length;
        // why not currentCharIndex ? because user not always finished a word when the time is up, accuracy is still apply to untyped char
      }
    }
  }
  const accuracy =
    ((totalTypedChars - wrongAnswers.length) / totalTypedChars) * 100;
  useEffect(() => {
    if (!isFinished) {
      // why justru !isFinished to set score ? because if isFinished == true, the app reset totalTypedChars and accuracy (on resetState)
      console.log("YYYYYYYYYYYY");
      setPreviousScore({
        WPM: totalTypedWords,
        accuracy: accuracy,
      });
    }
  }, [totalTypedChars, accuracy]);
  useEffect(() => {
    console.log(previousScore);
  }, [previousScore]);
  if (!isTimerRunning && previousScore.WPM && previousScore.accuracy) {
    return (
      <div className="text-center">
        <div className="font-bold">Previous Attempt</div>
        <div>
          WPM : <span className="font-semibold">{previousScore.WPM}</span>
        </div>
        <div>
          Character accuracy :{" "}
          <span className="font-semibold">{previousScore.accuracy}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        <div>
          WPM : <span className="font-semibold">{totalTypedWords}</span>
        </div>
        <div>
          Character accuracy : <span className="font-semibold">{accuracy}</span>
        </div>
      </div>
    );
  }
};

export default ResultScore;
