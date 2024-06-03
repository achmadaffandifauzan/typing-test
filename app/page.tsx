"use client";
import { useEffect, useState, useRef } from "react";
import { fetchTypingTestData } from "./apiService";
import MyTimer from "./countdown";
import ResultScore from "./result";
import Loading from "./components/Loading";
import Footer from "./footer";
import Header from "./header";
import DisplayCurrentQuote from "./DisplayCurrentQuote";
import DisplayNextQuote from "./DisplayNextQuote";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addQuotes,
  typingInputEvaluation,
  removeLastWrongCharacter,
  resetQuotes,
  shiftNextCharIndex,
  shiftPreviousCharIndex,
  shiftQuotesIndex,
  shiftWordIndex,
  updateAccuracy,
  updateWpm,
} from "@/lib/store";

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
  console.log("typingDocuments", typingDocuments);

  const [typedWord, setTypedWord] = useState<string>("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [triggerStartTime, setTriggerStartTime] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [fetchingHowManyTimesAlready, setFetchingHowManyTimesAlready] =
    useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const hasInitiallyFetchedData = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null); // for detect when user click start button, then to focus the input tag

  const [userAuthenticatedOnPageLoad, setUserAuthenticatedOnPageLoad] =
    useState(false);

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
  // console.log(currentQuoteIndex, currentWordIndex, currentCharIndex);

  // const currentQuoteIndex = documents.currentDocumentIndex;
  // const currentCharIndex =
  //   documents.quotes[documents.currentDocumentIndex].words[
  //     documents.quotes[documents.currentDocumentIndex].currentWordIndex
  //   ].currentCharIndex;
  // const currentWordIndex =
  //   documents.quotes[documents.currentDocumentIndex].currentWordIndex;

  // get user authentication status
  const { data: session, status } = useSession();

  const fetchData = async (ifRestart?: string) => {
    // console.log("requesting");
    if (!ifRestart) {
      // restart not adding fetchingHowManyTimesAlready because it already initially set to 1 for resetState()
      setFetchingHowManyTimesAlready(fetchingHowManyTimesAlready + 1);
    }
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
        // new quotes, to : 1. refresh page (replace empty initial quotes) ;or 2. reset quotes if counter is done
        // console.log("LOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLLOOLL");
        dispatch(resetQuotes());
        dispatch(addQuotes({ content, author }));
      } else {
        // adding to existing documents
        dispatch(addQuotes({ content, author }));
      }
    } catch (err) {
      setError("Error fetching data.");
      console.log("Error fetching data.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial fetch
    if (!hasInitiallyFetchedData.current) {
      setLoading(true);
      // console.log("Im fetching a quote");
      fetchData();
      hasInitiallyFetchedData.current = true;
    }

    if (status === "authenticated") {
      setUserAuthenticatedOnPageLoad(true);
      console.log("session =====", session);
    }
  }, []);

  useEffect(() => {
    // focus on input tag if user click start button
    if (isTimerRunning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTimerRunning]);

  useEffect(() => {
    if (userAuthenticatedOnPageLoad) {
      toast.success("Welcome Back!", { duration: 1500 });
    }
  }, [userAuthenticatedOnPageLoad]);

  const fetchMoreDocument = (ifRestart?: string) => {
    if (ifRestart === "restart") {
      // console.log("FETCH FROM RESTARTTTT");
      fetchData(ifRestart);
    } else if (
      fetchingHowManyTimesAlready ===
        typingDocuments.documents[currentAttemptNumber].quotes.length &&
      typingDocuments.documents[currentAttemptNumber].quotes.length -
        currentQuoteIndex <=
        1
    ) {
      // so if no fetched data coming queue, system ready to re-fetch
      // also, next quotes have to be existed max at 1
      // console.log("Im fetching a quote");
      fetchData();
    }
  };

  const resetStates = () => {
    setFetchingHowManyTimesAlready(1);
    dispatch(resetQuotes());

    setTypedWord("");
    setLoading(true);
    setError(null);
    setIsTimerRunning(false);
    setTriggerStartTime(false);
    setIsFinished(true);
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
          className="text-xl py-3 px-5 bg-indigo-400 text-white my-3 rounded-xl"
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
    if (!isTimerRunning && isFinished) {
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
            currentQuoteIndex,
            currentWordIndex,
            currentCharIndex: i,
            userInput: "space",
          })
        );
        dispatch(shiftNextCharIndex({ currentQuoteIndex, currentWordIndex }));
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
    } else if (event.target.value.slice(-1) === " ") {
      // reset typedWord and shift word index if user enter a space / when user input space
      dispatch(shiftWordIndex({ currentQuoteIndex }));
      setTypedWord("");
    } else if (event.target.value.length < typedWord.length) {
      // when user delete the char

      if (
        typingDocuments.documents[currentAttemptNumber].quotes[
          currentQuoteIndex
        ].words[currentWordIndex].chars[currentCharIndex - 1].typeStatus ===
        "incorrect"
      ) {
        // update wrong chars list, but only if user delete a wrong char
        dispatch(
          removeLastWrongCharacter({
            currentQuoteIndex,
            currentWordIndex,
            currentCharIndex,
          })
        );
      }
      // update current char index
      dispatch(shiftPreviousCharIndex({ currentQuoteIndex, currentWordIndex }));
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
            currentQuoteIndex,
            currentWordIndex,
            currentCharIndex,
            userInput: event.target.value.slice(-1),
          })
        );
        // update for next chart index
        dispatch(shiftNextCharIndex({ currentQuoteIndex, currentWordIndex }));
      }
    }

    // re-calculate wpm & accuracy
    const totalTyped = typingDocuments.documents[
      currentAttemptNumber
    ].quotes.reduce((sumTotal, quote) => {
      const subTotal = quote.words.reduce((sumSubTotal, word) => {
        if (word.chars[0].typeStatus !== "untyped") {
          return sumSubTotal + word.currentCharIndex;
        } else {
          return sumSubTotal;
        }
      }, 0);
      return sumTotal + subTotal;
    }, 0);

    let typedIncorrectly = 0;
    typingDocuments.documents[currentAttemptNumber].quotes.map((quote) => {
      quote.words.map((word) => {
        word.chars.map((char) => {
          if (char.typeStatus === "incorrect") {
            typedIncorrectly += 1;
          }
        });
      });
    });

    const accuracy = parseFloat(
      (((totalTyped - typedIncorrectly) / totalTyped) * 100).toFixed(1)
    );
    dispatch(updateAccuracy({ accuracy }));
    dispatch(updateWpm({ totalTyped }));
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
          setIsTimerRunning={setIsTimerRunning}
          triggerStartTime={triggerStartTime}
          setTriggerStartTime={setTriggerStartTime}
          resetStates={resetStates}
          setIsFinished={setIsFinished}
        />
        <input
          type="text"
          className="transition-all rounded-xl py-2 px-3 my-3 text-center text-2xl tracking-wider bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 active:w-80 focus:outline-none focus:ring focus:ring-indigo-300 ring ring-indigo-300 focus:w-80  w-64 no-underline "
          onChange={handleChange}
          value={typedWord}
          spellCheck="false"
          onKeyDown={handleKeyboardEvent}
          ref={inputRef}
          // below is to prevent the mouse events
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseDown={handleMouseEvents}
          onMouseUp={handleMouseEvents}
          onContextMenu={handleContextMenu}
        />
        <div className="flex sm:flex-row flex-col-reverse max-sm:items-center flex-wrap gap-4 justify-around w-full">
          <ResultScore
            isTimerRunning={isTimerRunning}
            isFinished={isFinished}
          />
          <div
            id="quotes"
            className="rounded-xl  bg-indigo-50 min-h-min sm:w-4/6 w-11/12 overflow-clip text-ellipsis  flex flex-col justify-between gap-2 sm:text-2xl text-base"
          >
            <div>
              <DisplayCurrentQuote />
              <DisplayNextQuote />
            </div>
            <div
              className="text-xs text-center p-1 cursor-help w-fit self-center hover:bg-indigo-200 rounded-md"
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
