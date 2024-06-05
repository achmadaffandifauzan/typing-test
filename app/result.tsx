"use client";

import DisplayCurrentAttempt from "./components/DisplayCurrentAttempt";
import { saveResultToDatabase } from "../lib/saveResult";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setAttemptSavedToDb, setTriggerSaveResult } from "@/lib/store";

const ResultScore = () => {
  const dispatch = useAppDispatch();
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  console.log(typingDocuments);
  const { data: session, status } = useSession();
  if (typingDocuments.triggerSaveResult) {
    // if <countdown/> trigger to save the result, then loop typingDocuments to save any unsaved result
    for (let i in typingDocuments.documents) {
      if (
        typingDocuments.documents[i].attemptStarted &&
        typingDocuments.documents[i].attemptFinished &&
        !typingDocuments.documents[i].attemptSavedtoDb &&
        status === "authenticated"
      ) {
        // if attempt has started, has finished, not yet saved to db && user is authenticated
        const attemptResult = typingDocuments.documents[i];
        const attemptNumber = parseInt(i);
        dispatch(setTriggerSaveResult({ trigger: "off" })); // turn off the trigger first before run async saveAttempt, to avoid multiple request, since the web app wont wait async to be resolved to run next code
        const saveAttempt = async () => {
          const result = await saveResultToDatabase(
            attemptResult,
            attemptNumber,
            session
          );
          if (result === true) {
            dispatch(setAttemptSavedToDb());
            toast.success("Saving result success!", { duration: 2500 });
          } else {
            dispatch(setTriggerSaveResult({ trigger: "on" })); // turn the trigger back on if failed to save
            toast.error("Saving result failed!", { duration: 1500 });
          }
        };
        saveAttempt();
      }
    }
  }
  return (
    <div className="text-center sm:text-base text-sm">
      <div className="flex sm:flex-col gap-5 flex-row flex-wrap justify-center items-center w-80">
        {<DisplayCurrentAttempt />}
      </div>
    </div>
  );
  // }
};

export default ResultScore;
