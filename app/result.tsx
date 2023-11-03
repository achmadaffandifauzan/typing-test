import { useEffect } from "react";
import { DocumentsSchema } from "./page";

interface ResultScoreProps {
  isFinished: boolean;
  setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
  documents: DocumentsSchema;
}
const ResultScore = ({
  documents,
  setIsFinished,
  isFinished,
}: ResultScoreProps) => {
  if (isFinished) {
    const wrongAnswers = documents.quotes
      .map((quoteObj) => {
        return quoteObj.words
          .map((wordObj) => {
            return wordObj.wrongCharacters;
          })
          .flat();
      })
      .flat();
    console.log(wrongAnswers);
    let totalTypedChars = 0;
    let totalTypedWords = 0;
    for (let quoteObj of documents.quotes) {
      if (quoteObj.currentWordIndex !== 0) {
        totalTypedWords += quoteObj.currentWordIndex;
      }
      for (let wordObj of quoteObj.words) {
        if (wordObj.currentCharIndex !== 0 && wordObj.chars.length !== 1) {
          // check if user already typing it, since some word is just 1 characters, and since all words (typed and not yet typed) have currentCharIndex of 0 by default
          totalTypedChars += wordObj.currentCharIndex + 1;
          // why not chars.length ? because user not always finished a word when the time is up
        }
      }
    }
    console.log("totalTypedChars : ", totalTypedChars);
    const accuracy =
      ((totalTypedChars - wrongAnswers.length) / totalTypedChars) * 100;
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
