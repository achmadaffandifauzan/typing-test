"use client";

import React from "react";
import { TagCloud } from "react-tagcloud";
import { useAppSelector } from "@/lib/hooks";

const DisplayTagCloud = () => {
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  const accuracy =
    typingDocuments.documents[typingDocuments.currentAttemptNumber].accuracy;
  return (
    <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
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
};

export default DisplayTagCloud;
