"use client";

import DisplayTagCloud from "./components/DisplayTagCloud";
import DisplayWPMAndAccuracy from "./components/DisplayWpmAccuracy";
import { DocumentsSchema, PreviousScore } from "./page";
import { useEffect, useState } from "react";
import { saveResultToDatabase } from "../lib/saveResult";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const ResultScore = () => {
  const dispatch = useAppDispatch();
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  const { data: session, status } = useSession();

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

  return (
    <div className="text-center sm:text-base text-sm">
      <div className="flex sm:flex-col gap-5 flex-row flex-wrap justify-center items-center w-80">
        {<DisplayWPMAndAccuracy />}
        {<DisplayTagCloud />}
      </div>
    </div>
  );
  // }
};

export default ResultScore;
