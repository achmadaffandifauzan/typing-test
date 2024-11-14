"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks";

const DisplayNextQuote = () => {
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  // make the variables to simplify the process
  const currentQuoteIndex =
    typingDocuments.documents[typingDocuments.currentAttemptNumber]
      .currentQuoteIndex;
  return (
    <div id="nextQuotes" className="p-4 text-justify ">
      {typingDocuments.documents[
        typingDocuments.currentAttemptNumber
      ].quotes.map((quoteObj, index) => {
        if (index > currentQuoteIndex) {
          // showing next quote
          return (
            <div key={`nextQuote_${index}`}>
              <div>
                {quoteObj.words.map((wordObj, index2) => {
                  return (
                    <span className="px-1" key={`nextQuote_${index}_${index2}`}>
                      {wordObj.text}{" "}
                    </span>
                  );
                })}
              </div>
              <div className="text-end text-slate-600 flex items-center justify-end gap-1.5">
                <span className="text-lg flex items-center">~ </span>
                <span className="text-base flex items-center">
                  {quoteObj.author}
                </span>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default DisplayNextQuote;
