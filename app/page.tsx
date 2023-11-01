"use client";
import { useEffect, useState, useRef } from "react";
import { fetchTypingTestData } from "./apiService";

export default function Home() {
  const [document, setDocument] = useState<string>("");
  const [documentKey, setDocumentKey] = useState<number>(0);
  const [word, setWord] = useState<string>("");
  const [wordIndexInDocument, setWordIndexInDocument] = useState<number>(0);
  const [char, setChar] = useState<string>("");
  const [charIndexInWord, setCharIndexInWord] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typedWord, setTypedWord] = useState<string>("");
  const [wrongCharacters, setWrongCharacters] = useState<Array<String>>([]);
  const hasFetchedData = useRef(false);

  const fetchData = async () => {
    console.log("requesting");
    setLoading(true);
    try {
      const data = await fetchTypingTestData();
      console.log(data);
      setDocument(data.content);
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchData();
      hasFetchedData.current = true;
    }
  }, []);
  useEffect(() => {
    setDocumentKey(documentKey + 1);
    // initial set for first word and first char in state
    setWord(document.split(" ")[0]);
    setWordIndexInDocument(0);
    setChar(document.split(" ")[0].slice(0, 1));
    setCharIndexInWord(0);
    setTypedWord("");
  }, [document]);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      loading ||
      event.target.value === typedWord ||
      (event.target.value.length === 1 && event.target.value.slice(-1) === " ")
    ) {
      // ignore if api data is loading || there is no changes || space in first char
      return null;
    }
    console.log(wordIndexInDocument);
    console.log(charIndexInWord);
    if (
      wordIndexInDocument === document.split(" ").length - 1 &&
      event.target.value.slice(-1) === " "
    ) {
      console.log("FETCH AGAINNN");
      return fetchData();
    } else if (event.target.value.slice(-1) === " ") {
      // reset states if user enter a space / when user input space
      setTypedWord("");
      setWord(document.split(" ")[wordIndexInDocument + 1]);
      setWordIndexInDocument(wordIndexInDocument + 1);
      setChar(document.split(" ")[wordIndexInDocument + 1].split("")[0]);
      setCharIndexInWord(0);
    } else if (event.target.value.length < typedWord.length) {
      // when user delete the char
      try {
        const removedDeletedChar = wrongCharacters.filter((char) => {
          return (
            char !==
            `${documentKey}_${wordIndexInDocument}_${charIndexInWord - 1}`
          );
        });
        setWrongCharacters(removedDeletedChar);
        setTypedWord(event.target.value);
        setChar(word.split("")[charIndexInWord - 1]);
        setCharIndexInWord(charIndexInWord - 1);
      } catch (error) {
        console.log(error);
      }
    } else {
      if (charIndexInWord < word.length) {
        // pastikan sisa huruf belum habis di kata itu
        setTypedWord(event.target.value);
        if (event.target.value.slice(-1) !== char) {
          // check char similarity
          console.log("not-the-same-char");
          const wrongCharactersState = [...wrongCharacters];
          wrongCharactersState.push(
            `${documentKey}_${wordIndexInDocument}_${charIndexInWord}`
          );
          setWrongCharacters(wrongCharactersState);
        }
        // set for next char
        setChar(word.split("")[charIndexInWord + 1]);
        setCharIndexInWord(charIndexInWord + 1);
      }
    }
  };

  return (
    <div className="w-full min-h-screen  flex flex-col flex-wrap justify-center items-center gap-2">
      <div
        id="word"
        className="border-2 rounded-xl border-gray-300 p-4 w-8/12 h-96"
      >
        {document.split(" ").map((word: String, wordIndex: Number) => {
          return (
            <span key={`${documentKey}_${word}_${wordIndex}`}>
              {word.split("").map((char: String, charIndex: Number) => {
                if (
                  wrongCharacters.includes(
                    `${documentKey}_${wordIndex}_${charIndex}`
                  )
                ) {
                  return (
                    <span
                      key={`${documentKey}_${word}_${char}_${charIndex}`}
                      className="bg-red-500"
                    >
                      {char}
                    </span>
                  );
                } else {
                  return (
                    <span key={`${documentKey}_${word}_${char}_${charIndex}`}>
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
