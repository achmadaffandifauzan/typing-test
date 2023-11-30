import React from "react";
import { DocumentsSchema } from "./page";

interface DisplayCurrentQuoteProps {
  documents: DocumentsSchema;
}
const DisplayCurrentQuote = ({ documents }: DisplayCurrentQuoteProps) => {
  // make the variables to simplify the process
  const currentQuoteIndex = documents.currentDocumentIndex;
  const currentWordIndex =
    documents.quotes[documents.currentDocumentIndex].currentWordIndex;
  return (
    <div
      id="currentQuotes"
      className="bg-indigo-100 p-4 rounded-xl text-justify"
    >
      <div>
        {documents.quotes[currentQuoteIndex].words.map((word, wordIndex) => {
          const children = (
            <>
              {word.chars.map((char: String, charIndex: Number) => {
                if (
                  word.wrongCharactersIndex.includes(
                    `${currentQuoteIndex}_${wordIndex}_${charIndex}`
                  )
                ) {
                  return (
                    <span
                      key={`${currentQuoteIndex}_${word}_${char}_${charIndex}`}
                      className="text-red-600"
                    >
                      {char}
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={`${currentQuoteIndex}_${word}_${char}_${charIndex}`}
                    >
                      {char}
                    </span>
                  );
                }
              })}
            </>
          );
          if (wordIndex === currentWordIndex) {
            return (
              <span key={`addSpace_${currentQuoteIndex}_${word}_${wordIndex}`}>
                <span
                  key={`${currentQuoteIndex}_${word}_${wordIndex}`}
                  className="p-1 bg-indigo-300 rounded-md tracking-wider"
                >
                  {children}
                </span>{" "}
              </span>
            );
          } else {
            return (
              <span key={`addSpace_${currentQuoteIndex}_${word}_${wordIndex}`}>
                <span
                  key={`${currentQuoteIndex}_${word}_${wordIndex}`}
                  className="p-1 tracking-wider"
                >
                  {children}
                </span>{" "}
              </span>
            );
          }
        })}
      </div>
      <div className="text-end text-slate-600 flex items-center justify-end gap-1.5">
        <span className="sm:text-lg text-base flex items-center">~ </span>
        <span className="sm:text-base text-sm flex items-center">
          {documents.quotes[currentQuoteIndex].originator}
        </span>
      </div>
    </div>
  );
};

export default DisplayCurrentQuote;
