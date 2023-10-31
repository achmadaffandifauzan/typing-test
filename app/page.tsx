"use client";
import { useEffect, useState } from "react";
import { fetchTypingTestData } from "./apiService";

export default function Home() {
  const [document, setDocument] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [wordIndexInDocument, setWordIndexInDocument] = useState<number>(0);
  const [char, setChar] = useState<string>("");
  const [charIndexInWord, setCharIndexInWord] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typedWord, setTypedWord] = useState<string>("");
  const [wrongCharacters, setWrongCharacters] = useState<Array<String>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTypingTestData();
        console.log(data);
        setDocument(data.quote);
        // initial set for first word and first char in state
        setWord(data.quote.split(" ")[0]);
        setChar(data.quote.split(" ")[0].slice(0, 1));
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) {
      if (event.target.value !== typedWord && event.target.value !== "") {
        // only refresh state if changes exist
        setTypedWord(event.target.value);
        if (event.target.value.slice(-1) === " ") {
          // reset states if user enter a space
          setTypedWord("");
          setWord(document.split(" ")[wordIndexInDocument + 1]);
          setWordIndexInDocument(wordIndexInDocument + 1);
          setChar("");
          setCharIndexInWord(0);
        } else {
          if (charIndexInWord < word.length) {
            // pastikan sisa huruf belum habis di kata itu
            if (event.target.value.slice(-1) !== char) {
              // check char similarity
              console.log("not-the-same-char");
            }
            // set for next char
            setChar(word.split("")[charIndexInWord + 1]);
            setCharIndexInWord(charIndexInWord + 1);
          }
        }
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
            <span key={`${word}_${wordIndex}`}>
              {word.split("").map((char: String, charIndex: Number) => {
                return <span key={`${word}_${char}_${charIndex}`}>{char}</span>;
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
