"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import ordinal from "ordinal";
import { TagCloud } from "react-tagcloud";
import { getTypingHistories } from "@/prisma/functions/typing";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

const DisplayPreviousAttempt = () => {
  const { data: session, status } = useSession();
  const [divsPreviousAttempts, setDivsPreviousAttempts] = useState([]);
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });

  const fetchAttemptsHistories = async () => {
    const typingHistories = await getTypingHistories(session?.user.username);
    if (!typingHistories) {
      return null;
    }

    let temp: any = [];
    for (let i = 0; i < typingHistories?.length; i++) {
      temp.push(
        <div
          key={`prev_attempt_${i}`}
          className="flex flex-col gap-4 bg-indigo-50 rounded-xl overflow-hidden text-center sm:w-3/12 w-11/12"
        >
          <div className="text-sm py-1 text-indigo-700 font-semibold rounded-xl bg-indigo-100">
            {dayjs(typingHistories[i].createdAt.toString()).format(
              "MMM D, YYYY"
            )}
          </div>
          <div className="flex flex-row gap-10  items-center justify-evenly">
            <div className="flex flex-col  items-center justify-center py-2 bg-indigo-100  rounded-xl ">
              <div className=" flex flex-col justify-center items-center px-2  text-sm rounded-xl w-28 ">
                WPM
              </div>
              <div className="flex font-bold text-xl text-indigo-800 justify-center items-center">
                {typingHistories[i].wpm}
              </div>
            </div>
            <div className="flex flex-col  items-center justify-center py-2 bg-indigo-100  rounded-xl ">
              <div className=" flex flex-col justify-center items-center px-2  text-sm rounded-xl w-28 ">
                Accuracy
              </div>
              <div className="flex font-semibold text-lg text-green-700  justify-center items-center">
                {typingHistories[i].accuracy}%
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
            <div className="sm:h-30 h-24">
              <span className="text-sm"> TagCloud innacurate character</span>
              <TagCloud
                minSize={15}
                maxSize={50}
                tags={typingHistories[i].wrongCharacters}
              />
            </div>
          </div>
        </div>
      );
    }
    setDivsPreviousAttempts(temp);
  };
  useEffect(() => {
    if (status === "authenticated") {
      // if authenticated, use db data
      fetchAttemptsHistories();
    } else if (status === "unauthenticated") {
      // if not authenticated, use the redux data
      let temp: any = [];
      for (let i in typingDocuments.documents) {
        if (
          typingDocuments.documents[i].attemptStarted &&
          typingDocuments.documents[i].attemptFinished
        ) {
          temp.push(
            <div
              key={`prev_attempt_${i}`}
              className="flex flex-col gap-4 bg-indigo-50 rounded-xl overflow-hidden text-center sm:w-3/12 w-11/12"
            >
              <div className="text-sm py-1 text-indigo-700 font-semibold rounded-xl bg-indigo-100">
                {ordinal(parseInt(i) + 1)} attempt
              </div>
              <div className="flex flex-row gap-10  items-center justify-evenly">
                <div className="flex flex-col  items-center justify-center py-2 bg-indigo-100  rounded-xl ">
                  <div className=" flex flex-col justify-center items-center px-2  text-sm rounded-xl w-28 ">
                    WPM
                  </div>
                  <div className="flex font-bold text-xl text-indigo-800 justify-center items-center">
                    {typingDocuments.documents[i].wpm}
                  </div>
                </div>
                <div className="flex flex-col  items-center justify-center py-2 bg-indigo-100  rounded-xl ">
                  <div className=" flex flex-col justify-center items-center px-2  text-sm rounded-xl w-28 ">
                    Accuracy
                  </div>
                  <div className="flex font-semibold text-lg text-green-700  justify-center items-center">
                    {typingDocuments.documents[i].accuracy}%
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-indigo-200 p-3 rounded-xl text-start">
                <div className="sm:h-30 h-24">
                  <span className="text-sm">
                    {" "}
                    TagCloud innacurate character
                  </span>
                  <TagCloud
                    minSize={15}
                    maxSize={50}
                    tags={typingDocuments.documents[i].wrongCharacters}
                  />
                </div>
              </div>
            </div>
          );
        }
      }
      setDivsPreviousAttempts(temp);
    }
  }, [status]);

  if (divsPreviousAttempts.length > 0) {
    return <>{divsPreviousAttempts}</>;
  } else {
    return <div className="text-sm font-semibold text-indigo-500">None!</div>;
  }
};

export default DisplayPreviousAttempt;
