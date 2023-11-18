"use client";
import { useEffect, useState, useRef } from "react";
import { fetchTypingTestData } from "./apiService";
import MyTimer from "./countdown";
import ResultScore from "./result";
import Loading from "./components/Loading";

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
}

const Home = () => {
  const [documents, setDocuments] = useState<DocumentsSchema>({
    quotes: [
      {
        text: "",
        words: [
          {
            text: "",
            chars: [""],
            currentCharIndex: 0,
            wrongCharacters: [],
            wrongCharactersIndex: [],
          },
        ],
        currentWordIndex: 0,
        originator: "",
      },
    ],
    currentDocumentIndex: 0,
  });
  const [typedWord, setTypedWord] = useState<string>("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [triggerStart, setTriggerStart] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [previousScore, setPreviousScore] = useState<PreviousScore>({
    WPM: 0,
    accuracy: 0,
  });
  const [fetchingHowManyTimesAlready, setFetchingHowManyTimesAlready] =
    useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasInitiallyFetchedData = useRef(false);

  // make the variables to simplify the process
  const currentWordObject =
    documents.quotes[documents.currentDocumentIndex].words[
      documents.quotes[documents.currentDocumentIndex].currentWordIndex
    ];
  const currentQuoteIndex = documents.currentDocumentIndex;
  const currentCharIndex =
    documents.quotes[documents.currentDocumentIndex].words[
      documents.quotes[documents.currentDocumentIndex].currentWordIndex
    ].currentCharIndex;
  const currentWordIndex =
    documents.quotes[documents.currentDocumentIndex].currentWordIndex;

  const fetchData = async (ifRestart?: string) => {
    console.log("requesting");
    if (!ifRestart) {
      // restart not adding fetchingHowManyTimesAlready because it already initially set to 1 for resetState()
      setFetchingHowManyTimesAlready(fetchingHowManyTimesAlready + 1);
    }
    try {
      const data = await fetchTypingTestData();
      console.log("data fresh from fetch :", data);
      const originatorName = data.originator.name;
      const content = data.content
        .replace(/[^a-zA-Z0-9'.,/()\-=&$@!?[\]{}:; \n]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (documents.quotes[0].words.length <= 1 || ifRestart === "restart") {
        // new quotes, to : 1. refresh page (replace empty initial quotes) ;or 2. reset quotes if counter is done
        console.log("LOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLLOOLL");
        const new_docs = {
          quotes: [
            {
              text: content,
              words: content.split(" ").map((word: string) => {
                return {
                  text: word,
                  chars: word.split(""),
                  currentCharIndex: 0,
                  wrongCharacters: [],
                  wrongCharactersIndex: [],
                };
              }),
              currentWordIndex: 0,
              originator: originatorName,
            },
          ],
          currentDocumentIndex: 0,
        };
        console.log(new_docs);
        setDocuments(new_docs);
      } else {
        // adding to existing documents
        const new_docs = {
          ...documents,
          quotes: [
            ...documents.quotes,
            {
              text: content,
              words: content.split(" ").map((word: string) => {
                return {
                  text: word,
                  chars: word.split(""),
                  currentCharIndex: 0,
                  wrongCharacters: [],
                  wrongCharactersIndex: [],
                };
              }),
              currentWordIndex: 0,
              originator: originatorName,
            },
          ],
        };
        console.log(new_docs);
        setDocuments(new_docs);
      }
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   console.log(documents);
  // }, [documents]);
  useEffect(() => {
    // initial fetch
    if (!hasInitiallyFetchedData.current) {
      setLoading(true);
      fetchData();
      hasInitiallyFetchedData.current = true;
    }
  }, []);
  const fetchMoreDocument = (ifRestart?: string) => {
    if (ifRestart === "restart") {
      console.log("FETCH FROM RESTARTTTT");
      fetchData(ifRestart);
    } else if (
      fetchingHowManyTimesAlready === documents.quotes.length &&
      documents.quotes.length - currentQuoteIndex <= 1
    ) {
      // so if no fetched data coming queue, system ready to re-fetch
      // also, next quotes have to be existed max at 1
      fetchData();
    }
  };
  const resetStates = () => {
    console.log("QQQQQQQ");
    setFetchingHowManyTimesAlready(1);
    setDocuments({
      quotes: [
        {
          text: "",
          words: [
            {
              text: "",
              chars: [""],
              currentCharIndex: 0,
              wrongCharacters: [],
              wrongCharactersIndex: [],
            },
          ],
          currentWordIndex: 0,
          originator: "",
        },
      ],
      currentDocumentIndex: 0,
    });
    setTypedWord("");
    setLoading(true);
    setError(null);
    setIsTimerRunning(false);
    setTriggerStart(false);
    setIsFinished(true);

    fetchMoreDocument("restart");
  };
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p>{error}</p>;
  }

  const rotateQuotes = () => {
    try {
      const updatedDocuments = { ...documents };
      updatedDocuments.currentDocumentIndex += 1;
      setDocuments(updatedDocuments);
      setTypedWord("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTimerRunning && isFinished) {
      console.log("AA");
      setTriggerStart(true);
    }
    if (
      loading ||
      event.target.value === typedWord ||
      (event.target.value.length === 1 &&
        event.target.value.slice(-1) === " ") ||
      (documents.quotes[currentQuoteIndex].words.length -
        (currentWordIndex + 1) ===
        0 &&
        event.target.value.slice(-1) === " " &&
        documents.quotes.length - (currentQuoteIndex + 1) === 0)
    ) {
      // ignore if api data is loading || there is no changes || space in first char || press space at the end of wordlist while there is no next quotes
      return null;
    }
    if (
      event.target.value.slice(-1) === " " &&
      documents.quotes[currentQuoteIndex].words.length -
        (documents.quotes[currentQuoteIndex].currentWordIndex + 1) <=
        6
    ) {
      console.log("FETCHMORREEEEEEE");
      // if on last 6 word of a quote, need to fetch again for the next quote to be shown, but with restriction on fetchMoreDocument() function
      fetchMoreDocument();
    }
    if (
      event.target.value.slice(-1) === " " &&
      documents.quotes[currentQuoteIndex].words[currentWordIndex].chars.length -
        currentCharIndex !==
        0
    ) {
      // if user hit space but there's still remaining char
      const updatedDocuments = { ...documents };
      let newWrongChars = [];
      let newWrongCharsIndex = [];

      for (
        let i = currentCharIndex;
        i <
        updatedDocuments.quotes[currentQuoteIndex].words[currentWordIndex].chars
          .length;
        i++
      ) {
        newWrongChars.push(
          updatedDocuments.quotes[currentQuoteIndex].words[currentWordIndex]
            .chars[i]
        );
        newWrongCharsIndex.push(
          `${currentQuoteIndex}_${currentWordIndex}_${i}`
        );
      }
      // assign updated wrongCharacters Array
      updatedDocuments.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].wrongCharacters.push(...newWrongChars);
      // assign updated wrongCharactersIndex Array
      updatedDocuments.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].wrongCharactersIndex.push(...newWrongCharsIndex);
      // update currentCharIndex by matching the chars length (for accuracy calculation also)
      documents.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].currentCharIndex =
        updatedDocuments.quotes[currentQuoteIndex].words[
          currentWordIndex
        ].chars.length;
      // update currentWordIndex happening in conditional below this
    }
    if (
      event.target.value.slice(-1) === " " &&
      documents.quotes[currentQuoteIndex].currentWordIndex ===
        documents.quotes[currentQuoteIndex].words.length - 1
    ) {
      // if on last word & user press space
      rotateQuotes();
    } else if (event.target.value.slice(-1) === " ") {
      // reset typedWord if user enter a space / when user input space
      const updatedDocuments = { ...documents };

      updatedDocuments.quotes[currentQuoteIndex].currentWordIndex += 1;
      setDocuments(updatedDocuments);
      setTypedWord("");
    } else if (event.target.value.length < typedWord.length) {
      // when user delete the char
      const removedAWrongChar = currentWordObject.wrongCharacters.splice(-1);
      const removedAWrongCharIndex =
        currentWordObject.wrongCharactersIndex.filter((char) => {
          return (
            char !==
            `${currentQuoteIndex}_${currentWordIndex}_${currentCharIndex - 1}`
          );
        });
      // updating documents state
      const updatedDocuments = { ...documents };
      // update wrong chars list
      updatedDocuments.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].wrongCharacters = removedAWrongChar;
      updatedDocuments.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].wrongCharactersIndex = removedAWrongCharIndex;
      // update current char index
      updatedDocuments.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].currentCharIndex -= 1;
      setDocuments(updatedDocuments);
      setTypedWord(event.target.value);
    } else {
      // console.log(currentWordObject);

      if (currentCharIndex < currentWordObject.chars.length) {
        // pastikan sisa huruf belum habis di kata itu
        setTypedWord(event.target.value);
        if (
          event.target.value.slice(-1) !==
          currentWordObject.chars[currentWordObject.currentCharIndex]
        ) {
          // check char similarity
          currentWordObject.wrongCharacters.push(
            currentWordObject.chars[currentWordObject.currentCharIndex]
          );
          // wrongCharactersIndex array -> docIndex_wordIndex_charIndex
          currentWordObject.wrongCharactersIndex.push(
            `${currentQuoteIndex}_${currentWordIndex}_${currentCharIndex}`
          );
        }
        // update for next chart index
        const updatedDocuments = { ...documents };
        updatedDocuments.quotes[currentQuoteIndex].words[
          currentWordIndex
        ].currentCharIndex += 1;
        setDocuments(updatedDocuments);
      }
    }
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
  return (
    <div className="w-full min-h-screen  flex flex-col flex-wrap  items-center gap-2 transition-all">
      <MyTimer
        setIsTimerRunning={setIsTimerRunning}
        triggerStart={triggerStart}
        setTriggerStart={setTriggerStart}
        resetStates={resetStates}
        setIsFinished={setIsFinished}
      />
      <div className="flex flex-row flex-wrap gap-4 justify-around w-full">
        <ResultScore
          documents={documents}
          isTimerRunning={isTimerRunning}
          previousScore={previousScore}
          setPreviousScore={setPreviousScore}
          isFinished={isFinished}
        />
        <div
          id="quotes"
          className="rounded-xl  bg-indigo-50 h-80 w-4/6 overflow-clip text-ellipsis pb-4"
        >
          <div
            id="currentQuotes"
            className="bg-indigo-100 p-4 rounded-xl text-justify"
          >
            <div>
              {documents.quotes[currentQuoteIndex].words.map(
                (word, wordIndex) => {
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
                      <span
                        key={`addSpace_${currentQuoteIndex}_${word}_${wordIndex}`}
                      >
                        <span
                          key={`${currentQuoteIndex}_${word}_${wordIndex}`}
                          className="text-2xl p-1 bg-indigo-300 rounded-md tracking-wider"
                        >
                          {children}
                        </span>{" "}
                      </span>
                    );
                  } else {
                    return (
                      <span
                        key={`addSpace_${currentQuoteIndex}_${word}_${wordIndex}`}
                      >
                        <span
                          key={`${currentQuoteIndex}_${word}_${wordIndex}`}
                          className="text-2xl p-1 tracking-wider"
                        >
                          {children}
                        </span>{" "}
                      </span>
                    );
                  }
                }
              )}
            </div>
            <div className="text-end text-slate-600 flex items-center justify-end gap-1.5">
              <span className="text-lg flex items-center">~ </span>
              <span className="text-base flex items-center">
                {documents.quotes[currentQuoteIndex].originator}
              </span>
            </div>
          </div>
          <div id="nextQotes" className="p-4 text-justify ">
            {documents.quotes.map((quoteObj, index) => {
              if (index > currentQuoteIndex) {
                return (
                  <div key={`nextQuote_${index}`} className="text-2xl">
                    <div>
                      {quoteObj.words.map((wordObj, index2) => {
                        return (
                          <span
                            className="px-1"
                            key={`nextQuote_${index}_${index2}`}
                          >
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
        </div>
      </div>
      <input
        type="text"
        className="transition-all rounded-xl py-2 px-3 mt-4 text-center text-2xl tracking-wider bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 active:w-80 focus:outline-none focus:ring focus:ring-indigo-300 ring ring-indigo-300 focus:w-80  w-64 no-underline"
        onChange={handleChange}
        value={typedWord}
        spellCheck="false"
        onKeyDown={handleKeyboardEvent}
      />
    </div>
  );
};

export default Home;
