"use client";

import React, { useEffect, useState } from "react";
import ordinal from "ordinal";
import dayjs from "dayjs";
import { useAppSelector } from "@/lib/hooks";
import { TagCloud } from "react-tagcloud";
import { getTypingHistories } from "@/prisma/functions/typing";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type AttemptType = {
  index: number;
  attemptStarted: boolean;
  attemptFinished: boolean;
  attemptSavedtoDb: boolean;
  quotes: {
    text: string;
    words: {
      text: string;
      currentCharIndex: number;
      chars: {
        text: string;
        typeStatus: string;
        userInput: string;
      }[];
    }[];
    currentWordIndex: number;
    author: string;
  }[];
  wrongCharacters: {
    value: string;
    count: number;
    userInputs: string[];
  }[];
  wpm: number;
  accuracy: number;
  currentQuoteIndex: number;
};

interface AttemptCardProps {
  attempt: AttemptType & { createdAt?: string };
  isRedux?: boolean;
}

const AttemptCard = React.memo(
  ({ attempt, isRedux = false }: AttemptCardProps) => (
    <div className="flex flex-col gap-4 bg-indigo-50 dark:bg-neutral-900 rounded-xl overflow-hidden text-center sm:w-3/12 w-11/12">
      <div className="text-sm py-1 text-indigo-700 dark:text-neutral-300 font-semibold rounded-xl bg-indigo-100 dark:bg-neutral-800">
        {isRedux
          ? `${ordinal(attempt.index + 1)} attempt`
          : dayjs(attempt.createdAt?.toString()).format("MMM D, YYYY")}
      </div>
      <div className="flex flex-row gap-10 items-center justify-evenly">
        <div className="flex flex-col items-center justify-center py-2 bg-indigo-100 dark:bg-neutral-800 rounded-xl">
          <div className="flex flex-col justify-center items-center px-2 text-sm rounded-xl w-28">
            WPM
          </div>
          <div className="flex font-bold text-xl text-indigo-800 dark:text-neutral-200 justify-center items-center">
            {attempt.wpm}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-2 bg-indigo-100 dark:bg-neutral-800 rounded-xl">
          <div className="flex flex-col justify-center items-center px-2 text-sm rounded-xl w-28">
            Accuracy
          </div>
          <div className="flex font-semibold text-lg text-green-700 justify-center items-center">
            {attempt.accuracy}%
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-indigo-200 dark:bg-neutral-900 p-3 rounded-xl text-start">
        <div className="sm:h-30 h-24">
          <span className="text-sm dark:text-neutral-500">
            Innacurate characters:
          </span>
          <TagCloud
            minSize={15}
            maxSize={50}
            shuffle={false}
            tags={attempt.wrongCharacters}
          />
        </div>
      </div>
    </div>
  )
);

const DisplayPreviousAttempt = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState<AttemptType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });
  const isLoadingSaveResult = useAppSelector(
    (state) => state.loading?.isLoadingSaveResult || false
  );

  const fetchAttemptsHistories = async (page = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const typingHistories = await getTypingHistories(
        session?.user.username,
        9,
        page * 9
      );

      if (!typingHistories || typingHistories.length < 9) {
        setHasMore(false);
      }

      if (typingHistories) {
        if (page === 0) {
          setAttempts(typingHistories);
        } else {
          setAttempts((prev) => [...prev, ...typingHistories]);
        }
      }
    } catch (error) {
      toast.error("Failed to load attempts", {
        id: "failed to load attempts",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchAttemptsHistories(nextPage);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAttemptsHistories();
    } else if (status === "unauthenticated") {
      const reduxAttempts = typingDocuments.documents
        .filter((doc) => doc.attemptStarted && doc.attemptFinished)
        .map((doc, i) => ({ ...doc, index: i }));
      setAttempts(reduxAttempts);
    }
  }, [status]);

  return (
    <div className="sm:px-10 px-3 flex flex-col w-full gap-5 justify-center items-center">
      <div className="flex flex-row flex-wrap gap-5 w-full justify-evenly items-center ">
        {attempts.map((attempt, i) => (
          <AttemptCard key={i} attempt={attempt} />
        ))}
        {attempts.length === 0 && !isLoading && !isLoadingSaveResult && (
          <div className="text-center  text-neutral-500">No attempts found</div>
        )}
        {isLoadingSaveResult && (
          <div className="text-center text-indigo-700 dark:text-neutral-400">
            Just a sec, saving your score!
          </div>
        )}
      </div>
      {hasMore && attempts.length !== 0 && (
        <button
          disabled={isLoading}
          className="py-2 px-4 bg-indigo-500 dark:bg-neutral-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={loadMore}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading
            </>
          ) : (
            "Load More"
          )}
        </button>
      )}
    </div>
  );
};

export default DisplayPreviousAttempt;
