"use client";
import { useEffect, useState, useRef } from "react";
import { fetchTypingTestData } from "./apiService";
interface DocumentsSchema {
  quotes: Quotes[];
  currentDocument: string;
  currentDocumentIndex: number;
}
interface Quotes {
  text: string;
  words: Words[];
  currentWord: string;
  currentWordIndex: number;
}
interface Words {
  text: string;
  chars: string[];
  currentChar: string;
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
            currentChar: "",
            currentCharIndex: 0,
            wrongCharacters: [],
          },
        ],
        currentWord: "",
        currentWordIndex: 0,
      },
    ],
    currentDocument: "",
    currentDocumentIndex: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typedWord, setTypedWord] = useState<string>("");
  const hasInitiallyFetchedData = useRef(false);

  const fetchData = async () => {
    console.log("requesting");
    try {
      const data = await fetchTypingTestData();
      console.log(data);
      // adding to existing documents
      if (documents.quotes.length > 1) {
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
                  currentChar: word.split("")[0],
                  currentCharIndex: 0,
                  wrongCharacters: [],
                };
              }),
              currentWord: data.content.split(" ")[0],
              currentWordIndex: 0,
            },
          ],
        };
        console.log(new_docs);
        setDocuments(new_docs);
      } else {
        // replacing the first empty documents state
        const new_docs = {
          quotes: [
            {
              text: data.content,
              words: data.content.split(" ").map((word: string) => {
                return {
                  text: word,
                  chars: word.split(""),
                  currentChar: word.split("")[0],
                  currentCharIndex: 0,
                  wrongCharacters: [],
                };
              }),
              currentWord: data.content.split(" ")[0],
              currentWordIndex: 0,
            },
          ],
          currentDocument: "",
          currentDocumentIndex: 0,
        };
        setDocuments(new_docs);
      }
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
    fetchData();
  };
  // useEffect(() => {
  //   setTimeout(() => {

  //   }, 1000);
  // }, []);
  useEffect(() => {
    if (documents.quotes.length > 1) {
      console.log(documents);
    }
  }, [documents]);
  // useEffect(() => {
  //   console.log(word);
  // }, [word]);
  // useEffect(() => {
  //   console.log(char);
  // }, [char]);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (
  //     loading ||
  //     event.target.value === typedWord ||
  //     (event.target.value.length === 1 && event.target.value.slice(-1) === " ")
  //   ) {
  //     // ignore if api data is loading || there is no changes || space in first char
  //     return null;
  //   }
  //   // if (
  //   //   documents.quotes[currentDocumentIndex] ===
  //   //     documents[currentDocumentKey].split(" ").length - 1 &&
  //   //   event.target.value.slice(-1) === " "
  //   // ) {
  //   //   console.log("FETCH AGAINNN");
  //   //   return fetchData();
  //   // }else
  //     if (event.target.value.slice(-1) === " ") {
  //     // reset states if user enter a space / when user input space
  //     setTypedWord("");
  //     setWord(
  //       documents[currentDocumentKey].split(" ")[wordIndexInDocument + 1]
  //     );
  //     setWordIndexInDocument(wordIndexInDocument + 1);
  //     setChar(
  //       documents[currentDocumentKey]
  //         .split(" ")
  //         [wordIndexInDocument + 1].split("")[0]
  //     );
  //     setCharIndexInWord(0);
  //   } else if (event.target.value.length < typedWord.length) {
  //     // when user delete the char
  //     try {
  //       const removedDeletedChar = wrongCharacters.filter((char) => {
  //         return (
  //           char !==
  //           `${currentDocumentKey}_${wordIndexInDocument}_${
  //             charIndexInWord - 1
  //           }`
  //         );
  //       });
  //       setWrongCharacters(removedDeletedChar);
  //       setTypedWord(event.target.value);
  //       setChar(word.split("")[charIndexInWord - 1]);
  //       setCharIndexInWord(charIndexInWord - 1);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     if (charIndexInWord < word.length) {
  //       // pastikan sisa huruf belum habis di kata itu
  //       setTypedWord(event.target.value);
  //       if (event.target.value.slice(-1) !== char) {
  //         // check char similarity
  //         console.log("not-the-same-char");
  //         const wrongCharactersState = [...wrongCharacters];
  //         wrongCharactersState.push(
  //           `${currentDocumentKey}_${wordIndexInDocument}_${charIndexInWord}`
  //         );
  //         setWrongCharacters(wrongCharactersState);
  //       }
  //       // set for next char
  //       setChar(word.split("")[charIndexInWord + 1]);
  //       setCharIndexInWord(charIndexInWord + 1);
  //     }
  //   }
  // };

  return (
    <div className="w-full min-h-screen  flex flex-col flex-wrap justify-center items-center gap-2">
      <div
        id="word"
        className="border-2 rounded-xl border-gray-300 p-4 w-8/12 h-96"
      >
        {documents.quotes[documents.currentDocumentIndex].words.map(
          (word, wordIndex) => {
            return (
              <span
                key={`${
                  documents.quotes[documents.currentDocumentIndex]
                }_${word}_${wordIndex}`}
              >
                {word.chars.map((char: String, charIndex: Number) => {
                  if (
                    word.wrongCharacters.includes(
                      `${documents.currentDocumentIndex}_${wordIndex}_${charIndex}`
                    )
                  ) {
                    return (
                      <span
                        key={`${documents.currentDocumentIndex}_${word}_${char}_${charIndex}`}
                        className="bg-red-500"
                      >
                        {char}
                      </span>
                    );
                  } else {
                    return (
                      <span
                        key={`${documents.currentDocumentIndex}_${word}_${char}_${charIndex}`}
                      >
                        {char}
                      </span>
                    );
                  }
                })}{" "}
              </span>
            );
          }
        )}
        <div></div>
        {typedWord}
      </div>
      <input
        type="text"
        className="border-2 rounded xl py-2 px-3 border-gray-300"
        // onChange={handleChange}
        readOnly
        value={typedWord}
      />
    </div>
  );
}
