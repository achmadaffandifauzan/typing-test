"use client";

import DisplayAccuracy from "./DisplayAccuracy";
import DisplayWPM from "./DisplayWPM";
import { DocumentsSchema, PreviousScore } from "./page";
import { useEffect, useState } from "react";
import { saveResultToDatabase } from "./saveResult";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateWpm, updateAccuracy } from "@/lib/store";

interface ResultScoreProps {
  isTimerRunning: boolean;
  isFinished: boolean;
}

const ResultScore = ({ isTimerRunning, isFinished }: ResultScoreProps) => {
  const dispatch = useAppDispatch();
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  const currentAttemptNumber = typingDocuments.currentAttemptNumber;
  const { data: session, status } = useSession();

  // useEffect(() => {
  //   const totalTyped = typingDocuments.documents[
  //     currentAttemptNumber
  //   ].quotes.reduce((sumTotal, quote) => {
  //     const subTotal = quote.words.reduce((sumSubTotal, word) => {
  //       if (word.chars[0].typeStatus !== "untyped") {
  //         return sumSubTotal + word.currentCharIndex;
  //       } else {
  //         return sumSubTotal;
  //       }
  //     }, 0);
  //     return sumTotal + subTotal;
  //   }, 0);

  //   let typedIncorrectly = 0;
  //   typingDocuments.documents[currentAttemptNumber].quotes.map((quote) => {
  //     quote.words.map((word) => {
  //       word.chars.map((char) => {
  //         if (char.typeStatus === "incorrect") {
  //           typedIncorrectly += 1;
  //         }
  //       });
  //     });
  //   });

  //   const accuracy = parseFloat(
  //     (((totalTyped - typedIncorrectly) / totalTyped) * 100).toFixed(1)
  //   );
  //   dispatch(updateAccuracy({ accuracy }));
  //   dispatch(updateWpm({ totalTyped }));
  // }, [typingDocuments]);

  // if (!isTimerRunning && previousScore.WPM && previousScore.accuracy) {
  //   // save result to db
  //   if (isFinished) {
  //     // useEffect(() => {
  //     if (previousScore.WPM !== 0) {
  //       // console.log("Sending result to server", previousScore);

  //       if (status === "authenticated") {
  //         const saveAttempt = async () => {
  //           const result = await saveResultToDatabase(previousScore, session);
  //           if (result == true) {
  //             toast.success("Saving result success!", { duration: 2500 });
  //           } else {
  //             toast.error("Saving result failed!", { duration: 1500 });
  //           }
  //         };
  //         saveAttempt();
  //       }
  //     }
  //     // }, [previousScore]);
  //   }`
  //   return (
  //     <div className="text-center">
  //       <div className="font-bold">Previous Attempt</div>
  //       <div className="flex sm:flex-col gap-5 flex-row flex-wrap justify-center items-center">
  //         {DisplayWPM({ currentOrPrevious: "previous", previousScore })}
  //         {DisplayAccuracy({ currentOrPrevious: "previous", previousScore })}
  //       </div>
  //     </div>
  //   );
  // } else {
  return (
    <div className="text-center sm:text-base text-sm">
      <div className="flex sm:flex-col gap-5 flex-row flex-wrap justify-center items-center w-80">
        {DisplayWPM()}
        {DisplayAccuracy()}
      </div>
    </div>
  );
  // }
};

export default ResultScore;
