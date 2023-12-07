import React from "react";
import { PreviousScore } from "./page";
interface DisplayWPMProps {
  currentOrPrevious: string;
  totalTypedWords?: number;
  previousScore?: PreviousScore;
}
const DisplayWPM = ({
  currentOrPrevious,
  //   below is optional, so the assignment is a default value
  totalTypedWords = 0,
  previousScore = {},
}: DisplayWPMProps) => {
  if (currentOrPrevious === "current") {
    return (
      <div className="flex flex-col bg-indigo-200 p-3 rounded-xl ">
        <span className="">WPM</span>
        <span className="font-semibold text-xl">{totalTypedWords}</span>
      </div>
    );
  } else if (currentOrPrevious === "previous") {
    return (
      <div className="flex flex-col bg-indigo-200 p-3 rounded-xl ">
        <span className="">WPM</span>
        <span className="font-semibold text-xl">{previousScore.WPM}</span>
      </div>
    );
  }
};

export default DisplayWPM;
