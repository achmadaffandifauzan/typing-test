"use client";
import { useEffect, useState, useRef } from "react";
import { fetchTypingTestData } from "./apiService";
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

  const hasInitiallyFetchedData = useRef(false);
  const hasReFetchedData = useRef(false);

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
    try {
      const data = await fetchTypingTestData();
      console.log(data);

      if (documents.quotes[0].words.length < 2) {
        // delete the init state data (empty)
        const updatedDocuments = { ...documents };
        updatedDocuments.quotes.shift();
        setDocuments(updatedDocuments);
      }
      // adding to existing documents
      console.log("I add to existing doc");
      const new_docs = {
        ...documents,
        quotes: [
          ...documents.quotes,
          {
            text: data.content,
            words: data.content.split(" ").map((word: string) => {
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
      hasReFetchedData.current = false;
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
    fetchData();
    hasReFetchedData.current = true;
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
    if (
      loading ||
      event.target.value === typedWord ||
      (event.target.value.length === 1 && event.target.value.slice(-1) === " ")
    ) {
      // ignore if api data is loading || there is no changes || space in first char
      return null;
    }
    if (
      event.target.value.slice(-1) === " " &&
      documents.quotes[currentQuoteIndex].words.length -
        documents.quotes[currentQuoteIndex].currentWordIndex <
        5 &&
      documents.quotes.length - (currentQuoteIndex + 1) === 0
    ) {
      // if on last 5 word of a quote, need to fetch again for the next quote to be shown (also not refetching again and again if 1 next quotes is already fetched)
      console.log("AAA");
      // use useRef to avoid fetching multiple time at same time
      // in this case, hasReFetchedData should be false first, then true-ing it after calling fetchData(), then false-ing again after data received
      if (!hasReFetchedData.current) {
        fetchMoreDocument();
      }
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
          console.log("not-the-same-char");
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
    <div className="w-full min-h-screen  flex flex-col flex-wrap justify-center items-center gap-2">
      <div
        id="word"
        className="border-2 rounded-xl border-gray-300 p-4 w-8/12 h-96"
      >
        {documents.quotes[currentQuoteIndex].words.map((word, wordIndex) => {
          return (
            <span
              key={`${documents.quotes[currentQuoteIndex]}_${word}_${wordIndex}`}
            >
              {word.chars.map((char: String, charIndex: Number) => {
                if (
                  word.wrongCharacters.includes(
                    `${currentQuoteIndex}_${wordIndex}_${charIndex}`
                  )
                ) {
                  return (
                    <span
                      key={`${currentQuoteIndex}_${word}_${char}_${charIndex}`}
                      className="bg-red-500"
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
              })}{" "}
            </span>
          );
        })}
        <div></div>
        {typedWord}
      </div>
      <input
        type="text"
        className="border-2 rounded xl py-2 px-3 border-gray-300"
        onChange={handleChange}
        value={typedWord}
      />
    </div>
  );
}
