"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks";
import { TagCloud } from "react-tagcloud";

const DisplayWPMAndAccuracy = () => {
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  return (
    <>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col  items-center bg-indigo-100  rounded-xl ">
          <div className=" flex flex-col justify-center items-center bg-indigo-200 p-3 rounded-xl w-28 ">
            WPM
          </div>
          <div className="flex font-bold text-xl text-indigo-800 h-full justify-center items-center p-2">
            {
              typingDocuments.documents[typingDocuments.currentAttemptNumber]
                .wpm
            }
          </div>
        </div>
        <div className="flex flex-col  items-center bg-indigo-100  rounded-xl ">
          <div className=" flex flex-col justify-center items-center bg-indigo-200 p-3 rounded-xl w-28 ">
            Accuracy
          </div>
          <div className="flex font-semibold text-lg text-green-700 h-full justify-center items-center p-2">
            {
              typingDocuments.documents[typingDocuments.currentAttemptNumber]
                .accuracy
            }
            %
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
        <div className="sm:h-48 h-36">
          <span>TagCloud innacurate character</span>
          <TagCloud
            minSize={15}
            maxSize={50}
            tags={
              typingDocuments.documents[typingDocuments.currentAttemptNumber]
                .wrongCharacters
            }
          />
        </div>
      </div>
    </>
  );
};

export default DisplayWPMAndAccuracy;
