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
        totalTypedChars += wordObj.currentCharIndex;
      }
    }
  }
  const accuracy = (
    ((totalTypedChars - wrongAnswers.length) / totalTypedChars) *
    100
  ).toFixed(1);
  useEffect(() => {
    if (!isFinished) {
      // why justru !isFinished to set score ? because if isFinished == true, the app reset totalTypedChars and accuracy (on resetState)
      setPreviousScore({
        WPM: totalTypedWords,
        accuracy: parseFloat(accuracy),
      });
    }
  }, [totalTypedChars, accuracy]);
  if (!isTimerRunning && previousScore.WPM && previousScore.accuracy) {
    return (
      <div className="text-center">
        <div className="font-bold">Previous Attempt</div>
        <div className="flex sm:flex-col gap-5 flex-row flex-wrap justify-center items-center">
          <div className="flex flex-col bg-indigo-200 p-3 rounded-xl ">
            <span className="">WPM</span>
            <span className="font-semibold text-xl">{previousScore.WPM}</span>
          </div>
          <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
            <div>
              <span>Character accuracy : </span>
              <span className="font-semibold">{previousScore.accuracy}%</span>
            </div>
            <div>
              <span>Most innacurate character : -</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        <div className="flex sm:flex-col gap-5 flex-row flex-wrap justify-center items-center">
          <div className="flex flex-col bg-indigo-200 p-3 rounded-xl ">
            <span className="">WPM</span>
            <span className="font-semibold text-xl">{totalTypedWords}</span>
          </div>
          <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
            <div>
              <span>Character accuracy : </span>
              <span className="font-semibold">{accuracy}%</span>
            </div>
            <div>
              <span>Most innacurate character : -</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ResultScore;
