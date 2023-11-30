"use client";

import DisplayAccuracy from "./DisplayAccuracy";
import DisplayWPM from "./DisplayWPM";
import { DocumentsSchema, PreviousScore } from "./page";
import { useEffect, useState } from "react";

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
  const [accuracy, setAccuracy] = useState<number>(0);
  const [totalTypedWords, setTotalTypedWords] = useState<number>(0);
  const [totalTypedChars, setTotalTypedChars] = useState<number>(0);
  const [wrongCharCount, setWrongCharCount] = useState<{
    [key: string]: number;
  }>({});
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
    // not very efficient way, always recalculate accuracy and wpm everytime user press char key
    for (let quoteObj of documents.quotes) {
      if (quoteObj.currentWordIndex !== 0) {
        temporaryTotalTypedWords += quoteObj.currentWordIndex;
      }
      for (let wordObj of quoteObj.words) {
        if (wordObj.currentCharIndex !== 0 && wordObj.chars.length !== 1) {
          // check if user already typing it, since some word is just 1 characters, and since all words (typed and not yet typed) have currentCharIndex of 0 by default
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
    console.log(flattenedWrongCharacters);
  }, [documents]);

  useEffect(() => {
    if (!isFinished) {
      // why justru !isFinished to set score ? because if isFinished == true, the app reset totalTypedChars and accuracy (on resetState)
      // previousScore only displayed after user is completing the typingtest
      setPreviousScore({
        WPM: totalTypedWords,
        accuracy: accuracy,
        wrongCharCount: wrongCharCount,
      });
    }
  }, [totalTypedChars, accuracy]);
  if (!isTimerRunning && previousScore.WPM && previousScore.accuracy) {
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
