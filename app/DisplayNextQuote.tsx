import React from "react";
import { DocumentsSchema } from "./page";
interface DisplayCurrentQuoteProps {
  documents: DocumentsSchema;
}

const DisplayNextQuote = ({ documents }: DisplayCurrentQuoteProps) => {
  // make the variables to simplify the process
  const currentQuoteIndex = documents.currentDocumentIndex;
  return (
    <div id="nextQotes" className="p-4 text-justify ">
      {documents.quotes.map((quoteObj, index) => {
        if (index > currentQuoteIndex) {
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
                  {quoteObj.originator}
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
