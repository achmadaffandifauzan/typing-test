"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks";

const DisplayCurrentQuote = () => {
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });

  // make the variables to simplify the process
  const currentQuoteIndex =
    typingDocuments.documents[typingDocuments.currentAttemptNumber]
      .currentQuoteIndex;
  const currentWordIndex =
    typingDocuments.documents[typingDocuments.currentAttemptNumber].quotes[
      currentQuoteIndex
    ].currentWordIndex;
  return (
    <div
      id="currentQuotes"
      className="bg-indigo-100 dark:bg-neutral-800 p-4 rounded-xl text-justify"
    >
      <div>
        {typingDocuments.documents[typingDocuments.currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words.map((word, wordIndex) => {
          const children = (
            <>
              {word.chars.map((char, charIndex) => {
                if (char.typeStatus === "incorrect") {
                  return (
                    <span
                      key={`${currentQuoteIndex}_${wordIndex}_${charIndex}`}
                      className="text-red-600"
                    >
                      {char.text}
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={`${currentQuoteIndex}_${wordIndex}_${charIndex}`}
                    >
                      {char.text}
                    </span>
                  );
                }
              })}
            </>
          );
          if (wordIndex === currentWordIndex) {
            return (
              <span key={`addSpace_${currentQuoteIndex}_${wordIndex}`}>
                <span
                  key={`${currentQuoteIndex}_${wordIndex}`}
                  className="p-1 bg-indigo-300 dark:bg-stone-700 rounded-md tracking-wider"
                >
                  {children}
                </span>{" "}
              </span>
            );
          } else {
            return (
              <span key={`addSpace_${currentQuoteIndex}}_${wordIndex}`}>
                <span
                  key={`${currentQuoteIndex}_${wordIndex}`}
                  className="p-1 tracking-wider"
                >
                  {children}
                </span>{" "}
              </span>
            );
          }
        })}
      </div>
      <div className="text-end text-slate-600 dark:text-neutral-400 flex items-center justify-end gap-1.5">
        <span className="sm:text-lg text-base flex items-center">~ </span>
        <span className="sm:text-base text-sm flex items-center">
          {
            typingDocuments.documents[typingDocuments.currentAttemptNumber]
              .quotes[currentQuoteIndex].author
          }
        </span>
      </div>
    </div>
  );
};

export default DisplayCurrentQuote;
