"use client";
import { useEffect, useState, useRef } from "react";
import { fetchTypingTestData } from "./apiService";
import MyTimer from "./countdown";

interface DocumentsSchema {
  quotes: Quotes[];
  currentDocumentIndex: number;
}
interface Quotes {
  text: string;
  words: Words[];
  currentWordIndex: number;
}
interface Words {
  text: string;
  chars: string[];
  currentCharIndex: number;
  wrongCharacters: string[];
}
var fetchingHowManyTimesAlready = 0;

export default function Home() {
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
          },
        ],
        currentWordIndex: 0,
      },
    ],
    currentDocumentIndex: 0,
  });
  const [typedWord, setTypedWord] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [triggerStart, setTriggerStart] = useState(false);

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

  const fetchData = async () => {
    console.log("requesting");
    fetchingHowManyTimesAlready += 1;
    try {
      const data = await fetchTypingTestData();
      // console.log(data);

      if (documents.quotes[0].words.length < 2) {
        // delete the init state data (empty)
        const updatedDocuments = { ...documents };
        updatedDocuments.quotes.shift();
        setDocuments(updatedDocuments);
      }
      // adding to existing documents
      const content = data.content.replace(/\n+/g, " ");
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
              };
            }),
            currentWordIndex: 0,
          },
        ],
      };
      console.log(new_docs);
      setDocuments(new_docs);
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial fetch
    if (!hasInitiallyFetchedData.current) {
      setLoading(true);
      fetchData();
      hasInitiallyFetchedData.current = true;
    }
  }, []);
  useEffect(() => {
    if (documents.quotes.length === 0) {
      setLoading(true);
    }
  }, []);
  const fetchMoreDocument = () => {
    if (
      fetchingHowManyTimesAlready === documents.quotes.length &&
      documents.quotes.length - currentQuoteIndex <= 1
    ) {
      // so if no fetched data coming queue, system ready to re-fetch
      // also, next quotes have to be existed max at 1
      fetchData();
    }
  };
  if (loading) {
    return <p>Loading...</p>;
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
    if (!isTimerRunning) {
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

      for (
        let i = currentCharIndex;
        i <
        updatedDocuments.quotes[currentQuoteIndex].words[currentWordIndex].chars
          .length;
        i++
      ) {
        newWrongChars.push(`${currentQuoteIndex}_${currentWordIndex}_${i}`);
      }
      // assign updated wrongChar Array
      updatedDocuments.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].wrongCharacters.push(...newWrongChars);
      // update indexing happening in conditional below this one
    }
    if (
      event.target.value.slice(-1) === " " &&
      documents.quotes[currentQuoteIndex].currentWordIndex ===
        documents.quotes[currentQuoteIndex].words.length - 1
    ) {
      // if on last word & user press space
      rotateQuotes();
    } else if (event.target.value.slice(-1) === " ") {
      // reset states if user enter a space / when user input space
      const updatedDocuments = { ...documents };

      updatedDocuments.quotes[currentQuoteIndex].currentWordIndex += 1;
      setDocuments(updatedDocuments);
      setTypedWord("");
    } else if (event.target.value.length < typedWord.length) {
      // when user delete the char
      const removedAWrongChar = currentWordObject.wrongCharacters.filter(
        (char) => {
          return (
            char !==
            `${currentQuoteIndex}_${currentWordIndex}_${currentCharIndex - 1}`
          );
        }
      );
      // updating documents state
      const updatedDocuments = { ...documents };
      // update wrong chart list
      updatedDocuments.quotes[currentQuoteIndex].words[
        currentWordIndex
      ].wrongCharacters = removedAWrongChar;
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
            `${currentQuoteIndex}_${currentWordIndex}_${currentCharIndex}`
          );
          // wrong char array -> docIndex_wordIndex_charIndex
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
  return (
    <div className="w-full min-h-screen  flex flex-col flex-wrap justify-center items-center gap-2 transition-all">
      <MyTimer
        setIsTimerRunning={setIsTimerRunning}
        triggerStart={triggerStart}
        setTriggerStart={setTriggerStart}
      />
      <div
        id="quotes"
        className="rounded-xl  bg-indigo-50 w-8/12 h-96 overflow-clip text-ellipsis pb-4"
      >
        <div
          id="currentQuotes"
          className="bg-indigo-100 p-4 rounded-xl text-justify"
        >
          {documents.quotes[currentQuoteIndex].words.map((word, wordIndex) => {
            const children = (
              <>
                {word.chars.map((char: String, charIndex: Number) => {
                  if (
                    word.wrongCharacters.includes(
                      `${currentQuoteIndex}_${wordIndex}_${charIndex}`
                    )
                  ) {
                    return (
                      <span
                        key={`${currentQuoteIndex}_${word}_${char}_${charIndex}`}
                        className="text-red-600 font-semibold"
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
          })}
        </div>
        <div id="nextQotes" className="p-4 text-justify ">
          {documents.quotes.map((quoteObj, index) => {
            if (index > currentQuoteIndex) {
              return (
                <div key={`nextQuote_${index}`} className="text-2xl">
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
              );
            }
          })}
        </div>
      </div>
      <input
        type="text"
        className="transition-all rounded-xl py-2 px-3 mt-4 text-center text-2xl tracking-wider bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 active:w-auto focus:outline-none focus:ring focus:ring-indigo-300 focus:w-auto  w-32 no-underline"
        onChange={handleChange}
        value={typedWord}
        spellCheck="false"
      />
    </div>
  );
}
