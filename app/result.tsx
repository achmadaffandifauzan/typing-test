"use client";

import DisplayAccuracy from "./DisplayAccuracy";
import DisplayWPM from "./DisplayWPM";
import { DocumentsSchema, PreviousScore } from "./page";
import { useEffect, useState } from "react";
import { saveResultToDatabase } from "./saveResult";
import { useSession } from "next-auth/react";

interface ResultScoreProps {
  documents: DocumentsSchema;
  isTimerRunning: boolean;
  previousScore: PreviousScore;
  setPreviousScore: React.Dispatch<React.SetStateAction<PreviousScore>>;
  isFinished: boolean;
  allTypedChar: string[];
}

const ResultScore = ({
  documents,
  isTimerRunning,
  previousScore,
  setPreviousScore,
  isFinished,
  allTypedChar,
}: ResultScoreProps) => {
  const [accuracy, setAccuracy] = useState<number>(0);
  const [totalTypedWords, setTotalTypedWords] = useState<number>(0);
  const [totalTypedChars, setTotalTypedChars] = useState<number>(0);
  const [wrongCharCount, setWrongCharCount] = useState<{
    [key: string]: number;
  }>({});
  const { data: session, status } = useSession();
  // state example
  // }
  //   "a": 2,
  //   "b": 2,
  //   "c": 1,
  // }

  useEffect(() => {
    let flattenedWrongCharacters = [];
    let flattenedWrongCharactersIndex = [];
    for (let quoteObj of documents.quotes) {
      for (let wordObj of quoteObj.words) {
        if (wordObj.wrongCharacters.length > 0) {
          flattenedWrongCharacters.push(...wordObj.wrongCharacters);
          flattenedWrongCharactersIndex.push(...wordObj.wrongCharactersIndex);
        }
      }
    }
    let temporaryTotalTypedWords = 0;
    let temporaryTotalTypedChars = 0;
    // not very efficient way, it always recalculate accuracy and wpm everytime user press char key
    for (let quoteObj of documents.quotes) {
      if (quoteObj.currentWordIndex !== 0) {
        temporaryTotalTypedWords += quoteObj.currentWordIndex;
      }
      for (let wordObj of quoteObj.words) {
        if (wordObj.currentCharIndex !== 0) {
          // check if user already typing it, why check? so system doesn't need to loop over words that havent been typed
          temporaryTotalTypedChars += wordObj.currentCharIndex;
        }
      }
    }
    setTotalTypedWords(temporaryTotalTypedWords);
    setTotalTypedChars(temporaryTotalTypedChars);

    const temporaryWrongCharCount: { [key: string]: number } = {};
    flattenedWrongCharacters.forEach((ele: string) => {
      if (temporaryWrongCharCount[ele]) {
        temporaryWrongCharCount[ele] += 1;
      } else {
        temporaryWrongCharCount[ele] = 1;
      }
    });
    // not updating state inside a loop. Instead, using temporaryWrongCharCount
    setWrongCharCount(temporaryWrongCharCount);

    // on setAccuracy, why not using totalTypedWords state? because not real time value / because the state value is not updated directly after setTotalTypedWords() above
    setAccuracy(
      parseFloat(
        (
          ((temporaryTotalTypedChars - flattenedWrongCharactersIndex.length) /
            temporaryTotalTypedChars) *
          100
        ).toFixed(1)
      )
    );
  }, [documents]);

  useEffect(() => {
    if (!isFinished) {
      // why justru !isFinished to set score ? because if isFinished == true, the app reset totalTypedChars and accuracy (on resetState)
      // previousScore only displayed after user is completing the typingtest
      setPreviousScore({
        allTypedChar: allTypedChar,
        WPM: totalTypedWords,
        accuracy: accuracy,
        wrongCharacters: wrongCharCount,
      });
    }
  }, [totalTypedChars, accuracy]);
  if (!isTimerRunning && previousScore.WPM && previousScore.accuracy) {
    // save result to db
    if (isFinished) {
      useEffect(() => {
        if (previousScore.WPM !== 0) {
          console.log("Sending result to server", previousScore);

          if (status === "authenticated") {
            const saveAttempt = saveResultToDatabase(previousScore, session);
            console.log(saveAttempt);
          }
        }
      }, [previousScore]);
    }
    return (
      <div className="text-center">
        <div className="font-bold">Previous Attempt</div>
        <div className="flex sm:flex-col gap-5 flex-row flex-wrap justify-center items-center">
          {DisplayWPM({ currentOrPrevious: "previous", previousScore })}
          {DisplayAccuracy({ currentOrPrevious: "previous", previousScore })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center sm:text-base text-sm">
        <div className="flex sm:flex-col gap-5 flex-row flex-wrap justify-center items-center w-80">
          {DisplayWPM({ currentOrPrevious: "current", totalTypedWords })}
          {DisplayAccuracy({
            currentOrPrevious: "current",
            accuracy,
            wrongCharCount,
          })}
        </div>
      </div>
    );
  }
};

export default ResultScore;
