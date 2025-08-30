"use client";
import { useEffect, useState, useRef } from "react";
import { fetchTypingTestData } from "../lib/fetchQuotes";
import MyTimer from "./components/countdown";
import ResultScore from "./result";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import Header from "./components/Header";
import DisplayCurrentQuote from "./components/DisplayCurrentQuote";
import DisplayNextQuote from "./components/DisplayNextQuote";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addQuotes,
  typingInputEvaluation,
  removeLastWrongCharacter,
  shiftNextCharIndex,
  shiftPreviousCharIndex,
  shiftQuotesIndex,
  shiftWordIndex,
  calculateAccuracy,
  increaseWpm,
  addAttempt,
  shiftNextAttempt,
  userFinishTyping,
  addQuoteReceived,
  addQuoteFetchAttempt,
} from "@/lib/store";
import DisplayPreviousAttempt from "./components/DisplayPreviousAttempts";
import { TagCloud } from "react-tagcloud";

export type { DocumentsSchema, PreviousScore };
interface DocumentsSchema {
  quotes: Quotes[];
  currentDocumentIndex: number;
}
interface Quotes {
  text: string;
  words: Words[];
  currentWordIndex: number;
  originator: string;
}
interface Words {
  text: string;
  chars: string[];
  currentCharIndex: number;
  wrongCharacters: string[];
  wrongCharactersIndex: string[];
}
interface PreviousScore {
  WPM?: number;
  accuracy?: number;
  wrongCharacters?: object;
}

const Home = () => {
  const dispatch = useAppDispatch();
  const typingDocuments = useAppSelector((state) => {
    return state.typingDocuments;
  });

  const [typedWord, setTypedWord] = useState<string>("");
  const [triggerStartTime, setTriggerStartTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // for detect when user click start button, then to focus the input tag

  // make the variables to simplify the process
  const currentAttemptNumber = typingDocuments.currentAttemptNumber;
  const currentQuoteIndex =
    typingDocuments.documents[typingDocuments.currentAttemptNumber]
      .currentQuoteIndex;
  const currentWordIndex =
    typingDocuments.documents[typingDocuments.currentAttemptNumber].quotes[
      typingDocuments.documents[typingDocuments.currentAttemptNumber]
        .currentQuoteIndex
    ].currentWordIndex;
  const currentCharIndex =
    typingDocuments.documents[typingDocuments.currentAttemptNumber].quotes[
      typingDocuments.documents[typingDocuments.currentAttemptNumber]
        .currentQuoteIndex
    ].words[
      typingDocuments.documents[typingDocuments.currentAttemptNumber].quotes[
        typingDocuments.documents[typingDocuments.currentAttemptNumber]
          .currentQuoteIndex
      ].currentWordIndex
    ].currentCharIndex;

  const fetchData = async (ifRestart?: string) => {
    // console.log("fetching quote!!!");
    try {
      const data = await fetchTypingTestData();
      const author = data.originator.name;
      const content = data.content
        .replace(/[^a-zA-Z0-9'.,/()\-=&$@!?[\]{}:; \n]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (
        typingDocuments.documents[currentAttemptNumber].quotes[0].words
          .length <= 1 ||
        ifRestart === "restart"
      ) {
        // new quotes, to : 1. refresh page (replace empty initial quotes by adding new attempt) ;or 2. reset quotes by adding new attempt if counter is done
        dispatch(addAttempt());
        dispatch(addQuotes({ content, author }));
      } else {
        // adding to existing documents
        dispatch(addQuotes({ content, author }));
      }
      dispatch(addQuoteReceived());
    } catch (err) {
      setError("Error fetching data.");
      console.log("Error fetching data.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false); // cleaning redirect / router pushes loading state from login / register
    // initial fetch
    if (typingDocuments.nFetchingQuotes === 0) {
      setLoading(true);
      // console.log("INITIALLY Im fetching a quote");
      dispatch(addQuoteFetchAttempt());
      fetchData();
    }
  }, []);

  useEffect(() => {
    // focus on input tag if user click start button
    if (
      typingDocuments.documents[currentAttemptNumber].attemptStarted &&
      !typingDocuments.documents[currentAttemptNumber].attemptFinished &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [typingDocuments]);

  const fetchMoreDocument = (ifRestart?: string) => {
    // all quote fetching is centralized here, to manage req queue
    if (ifRestart === "restart") {
      dispatch(addQuoteFetchAttempt());
      setLoading(true);
      fetchData(ifRestart);
    } else if (
      typingDocuments.nFetchingQuotes === typingDocuments.nRecievedQuotes &&
      typingDocuments.documents[currentAttemptNumber].quotes.length -
        currentQuoteIndex <=
        1
    ) {
      // so if no fetched data coming queue, system ready to re-fetch
      // also, next quotes have to be existed max at 1
      // console.log("Im fetching a quote");
      dispatch(addQuoteFetchAttempt());
      fetchData();
    }
  };

  const resetStates = () => {
    dispatch(userFinishTyping());
    dispatch(addAttempt());
    dispatch(shiftNextAttempt());

    setTypedWord("");
    setLoading(true);
    setError(null);
    setTriggerStartTime(false);
    setIsInputFocused(false);

    fetchMoreDocument("restart");
  };

  if (loading) {
    return <Loading />;
  }
  if (error == "Error fetching data.") {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="flex flex-row justify-center items-center">
          <div className="font-semibold">Unable to fetch quotes, sorry</div>
          <img src="/icons/sad.svg" className="sm:w-9 w-6" alt="" />
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-xl py-3 px-5 bg-indigo-400 dark:bg-indigo-600 text-white my-3 rounded-xl"
        >
          Try again
        </button>
      </div>
    );
  }

  const rotateQuotes = () => {
    try {
      dispatch(shiftQuotesIndex());
      setTypedWord("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !typingDocuments.documents[currentAttemptNumber].attemptStarted &&
      !typingDocuments.documents[currentAttemptNumber].attemptFinished
    ) {
      setTriggerStartTime(true);
    }
    if (
      loading ||
      event.target.value === typedWord ||
      (event.target.value.length === 1 &&
        event.target.value.slice(-1) === " ") ||
      (typingDocuments.documents[currentAttemptNumber].quotes[currentQuoteIndex]
        .words.length -
        (currentWordIndex + 1) ===
        0 &&
        event.target.value.slice(-1) === " " &&
        typingDocuments.documents[currentAttemptNumber].quotes.length -
          (currentQuoteIndex + 1) ===
          0)
    ) {
      // ignore if api data is loading || there is no changes || space in first char || at the end of wordlist, press space, while there is no next quotes
      return null;
    }
    if (
      event.target.value.slice(-1) === " " &&
      typingDocuments.documents[currentAttemptNumber].quotes[currentQuoteIndex]
        .words.length -
        (typingDocuments.documents[currentAttemptNumber].quotes[
          currentQuoteIndex
        ].currentWordIndex +
          1) <=
        9
    ) {
      // console.log("FETCHMORREEEEEEE");
      // if on last 9 word of a quote, need to fetch again for the next quote to be shown, but with restriction on fetchMoreDocument() function
      fetchMoreDocument();
    }
    if (
      event.target.value.slice(-1) === " " &&
      typingDocuments.documents[currentAttemptNumber].quotes[currentQuoteIndex]
        .words[currentWordIndex].chars.length -
        currentCharIndex !==
        0
    ) {
      // if user hit space but there's still remaining char
      for (
        let i = currentCharIndex;
        i <
        typingDocuments.documents[currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars.length;
        i++
      ) {
        dispatch(
          typingInputEvaluation({
            userInput: "space",
          })
        );
        dispatch(shiftNextCharIndex());
      }

      // update currentWordIndex happening in conditional below this
    }
    if (
      event.target.value.slice(-1) === " " &&
      currentWordIndex ===
        typingDocuments.documents[currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words.length -
          1
    ) {
      // if on last word & user press space
      rotateQuotes();
      dispatch(increaseWpm());
    } else if (event.target.value.slice(-1) === " ") {
      // reset typedWord and shift word index if user enter a space / when user input space
      dispatch(shiftWordIndex());
      setTypedWord("");
      dispatch(increaseWpm());
    } else if (event.target.value.length < typedWord.length) {
      // when user delete the char

      if (
        typingDocuments.documents[currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars[currentCharIndex - 1].typeStatus ===
        "incorrect"
      ) {
        // update wrong chars list, but only if user delete a wrong char
        dispatch(removeLastWrongCharacter());
      }
      // update current char index
      dispatch(shiftPreviousCharIndex());
      setTypedWord(event.target.value);
    } else {
      if (
        currentCharIndex <
        typingDocuments.documents[currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars.length
      ) {
        // make sure there are no remaining char in the word
        setTypedWord(event.target.value);
        // correctness evaluation happened in typingDocuments reducer
        dispatch(
          typingInputEvaluation({
            userInput: event.target.value.slice(-1),
          })
        );
        // update for next chart index
        dispatch(shiftNextCharIndex());
      }
    }

    // re-calculate wpm & accuracy
    dispatch(calculateAccuracy());
  };

  const handleKeyboardEvent = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const PreventedKeys = ["ArrowLeft"];
    if (PreventedKeys.includes(event.key)) {
      event.preventDefault();
    } else if (event.ctrlKey) {
      event.preventDefault();
    }
    return null;
  };

  // 4 below is to prevent any mouse event after input tag is focused, so that prevent like moving the "caret" or delete multiple chars at the same thme
  const handleFocus = () => {
    setIsInputFocused(true);
  };
  const handleBlur = () => {
    setIsInputFocused(false);
  };
  const handleMouseEvents = (event: React.MouseEvent<HTMLInputElement>) => {
    // Disable mouse events if input is focused
    if (isInputFocused) {
      event.preventDefault();
    }
  };
  const handleContextMenu = (event: React.MouseEvent<HTMLInputElement>) => {
    // Prevent right-click context menu
    event.preventDefault();
  };

  return (
    <>
      <div className="w-full min-h-screen  flex flex-col flex-wrap  items-center gap-2 transition-all">
        <Header />
        <MyTimer
          triggerStartTime={triggerStartTime}
          setTriggerStartTime={setTriggerStartTime}
          resetStates={resetStates}
        />
        <input
          type="text"
          id="inputTyping"
          className="transition-all rounded-xl py-2 px-3 my-3 text-center text-2xl tracking-wider bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 active:bg-indigo-200 dark:active:bg-indigo-800 active:w-80 focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700 ring ring-indigo-300 dark:ring-indigo-700 focus:w-80  w-64 no-underline "
          onChange={handleChange}
          value={typedWord}
          spellCheck="false"
          onKeyDown={handleKeyboardEvent}
          ref={inputRef}
          autoCapitalize="off"
          autoComplete="off"
          // below is to prevent the mouse events
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseEvents}
          onMouseUp={handleMouseEvents}
          onContextMenu={handleContextMenu}
        />
        <div className="flex sm:flex-row flex-col max-sm:items-center flex-wrap gap-4 sm:gap-y-10 gap-y-5 justify-around w-full mb-10">
          <ResultScore />
          <div
            id="quotes"
            className="rounded-xl  bg-indigo-50 dark:bg-indigo-950 min-h-min sm:w-4/6 w-11/12 overflow-clip text-ellipsis  flex flex-col justify-between gap-2 sm:text-2xl text-base"
          >
            <div>
              <DisplayCurrentQuote />
              <DisplayNextQuote />
            </div>
            <div
              className="text-xs text-center p-1 px-2 cursor-help w-fit self-center hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-md"
              onMouseDown={() =>
                toast.warning(
                  "Some quotes may contains inappropriate language. I do not have the ability to filter specific quotes, as they are generated randomly",
                  {
                    id: "disclaimer quotes",
                  }
                )
              }
              onMouseEnter={() =>
                toast.warning(
                  "Some quotes may contains inappropriate language. I do not have the ability to filter specific quotes, as they are generated randomly",
                  {
                    id: "disclaimer quotes",
                  }
                )
              }
            >
              Be aware that those quotes are{" "}
              <span className="text-blue-500 font-bold ">RANDOM</span>,
              generated from
              <a
                href="https://rapidapi.com/martin.svoboda/api/quotes15/"
                className="text-blue-500"
                target="_blank"
              >
                {" "}
                Here
              </a>
            </div>
          </div>
          {/* only in small displays, big one on the <DisplayCurrentAttempt/> */}
          <div className="sm:hidden flex flex-col bg-indigo-200 dark:bg-indigo-800 p-3 rounded-xl text-start  w-11/12">
            <div className="h-30 text-md text-center">
              <span>TagCloud innacurate character</span>
              <TagCloud
                minSize={15}
                maxSize={50}
                shuffle={false}
                tags={
                  typingDocuments.documents[
                    typingDocuments.currentAttemptNumber
                  ].wrongCharacters
                }
              />
            </div>
          </div>
          <div className="sm:w-8/12 w-11/12 bg-indigo-500 text-white font-semibold text-center rounded-xl text-sm py-0.5 max-sm:mt-10">
            Previous Attempts :
          </div>
          <div className=" flex flex-row flex-wrap gap-5 justify-evenly items-center w-full sm:px-10 px-3">
            <DisplayPreviousAttempt />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
