"use client";

import React from "react";
import { TagCloud } from "react-tagcloud";
import { PreviousScore } from "./page";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const DisplayAccuracy = () => {
  const dispatch = useAppDispatch();
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  // const temporaryWrongCharCount: { [key: string]: number } = {};
  // flattenedWrongCharacters.forEach((ele: string) => {
  //   if (temporaryWrongCharCount[ele]) {
  //     temporaryWrongCharCount[ele] += 1;
  //   } else {
  //     temporaryWrongCharCount[ele] = 1;
  //   }
  // });

  // if (currentOrPrevious === "current") {
  const accuracy =
    typingDocuments.documents[typingDocuments.currentAttemptNumber].accuracy;
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
        {/* <TagCloud
            minSize={15}
            maxSize={50}
            tags={Object.entries(wrongCharCount).map(([value, count]) => ({
              value,
              count,
            }))}
          /> */}
      </div>
    </div>
  );
  // } else if (currentOrPrevious === "previous") {
  //   return (
  //     <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
  //       <div>
  //         <span>Character accuracy : </span>
  //         <span className="font-semibold">{previousScore.accuracy}%</span>
  //       </div>
  //       <div>
  //         {/*<span>TagCloud innacurate character</span>
  //          <TagCloud
  //         minSize={15}
  //         maxSize={50}
  //         tags={Object.entries(previousScore.wrongCharCount).map(
  //           ([value, count]) => ({
  //             value,
  //             count,
  //           })
  //         )}
  //       /> */}
  //       </div>
  //     </div>
  //   );
  // }
};

export default DisplayAccuracy;
