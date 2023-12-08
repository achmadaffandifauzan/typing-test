import React from "react";
import { TagCloud } from "react-tagcloud";
import { PreviousScore } from "./page";

interface DisplayAccuracyProps {
  currentOrPrevious: string;
  accuracy?: number;
  wrongCharCount?: {
    [key: string]: number;
  };
  previousScore?: PreviousScore;
}
const DisplayAccuracy = ({
  currentOrPrevious,
  //   below is optional, so the assignment is a default value
  accuracy = 0,
  wrongCharCount = {},
  previousScore = {},
}: DisplayAccuracyProps) => {
  if (currentOrPrevious === "current") {
    return (
      <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
        <div>
          <span>Character accuracy : </span>
          {accuracy ? (
            <span className="font-semibold">{accuracy}%</span>
          ) : (
            <span className="font-semibold">-</span>
          )}
        </div>
        <div className="sm:h-48 h-36">
          <span>TagCloud innacurate character</span>
          <TagCloud
            minSize={15}
            maxSize={50}
            tags={Object.entries(wrongCharCount).map(([value, count]) => ({
              value,
              count,
            }))}
          />
        </div>
      </div>
    );
  } else if (currentOrPrevious === "previous") {
    return (
      <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
        <div>
          <span>Character accuracy : </span>
          <span className="font-semibold">{previousScore.accuracy}%</span>
        </div>
        <div>
          {/*<span>TagCloud innacurate character</span>
           <TagCloud
          minSize={15}
          maxSize={50}
          tags={Object.entries(previousScore.wrongCharCount).map(
            ([value, count]) => ({
              value,
              count,
            })
          )}
        /> */}
        </div>
      </div>
    );
  }
};

export default DisplayAccuracy;
