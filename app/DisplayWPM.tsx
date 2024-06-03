"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks";

const DisplayWPM = () => {
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  return (
    <div className="flex flex-col bg-indigo-200 p-3 rounded-xl ">
      <span className="">WPM</span>
      <span className="font-semibold text-xl">
        {typingDocuments.documents[typingDocuments.currentAttemptNumber].wpm}
      </span>
    </div>
  );
};

export default DisplayWPM;
