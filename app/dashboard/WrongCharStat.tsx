"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useSession } from "next-auth/react";
import Loading from "@/app/components/Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TagCloud } from "react-tagcloud";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MergedWrongCharacters {
  [char: string]: {
    wrongInputs: string[];
    count: number;
  };
}
const WrongCharStat = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [typingHistories, setTypingHistories] = useState([]);
  const [mergedWrongCharacters, setMergedWrongCharacters] =
    useState<MergedWrongCharacters>({});
  const [hoveredChar, setHoveredChar] = useState("");

  const fetchTypingHistories = async () => {
    try {
      const encodedUsername = encodeURIComponent(session?.user.username!);
      //   URL that might include special characters should be encoded
      const response = await fetch(`/api/typing/user/${encodedUsername}`, {
        method: "GET",
      });
      if (response.status === 200) {
        const typings = await response.json();
        setTypingHistories(typings);
        setLoading(false);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to fetch dashboard data!", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "authenticated") {
      fetchTypingHistories();
    } else {
      setLoading(false);
    }
  }, [status]);
  useEffect(() => {
    const mergedWrongCharactersTemp: MergedWrongCharacters = {};
    if (typingHistories) {
      typingHistories.forEach((typingHistory: any) => {
        typingHistory.wrongCharacters.forEach((wrongCharObject: any) => {
          if (mergedWrongCharactersTemp[wrongCharObject.value]) {
            mergedWrongCharactersTemp[wrongCharObject.value].wrongInputs.push(
              ...wrongCharObject.userInputs
            );
            mergedWrongCharactersTemp[wrongCharObject.value].count =
              mergedWrongCharactersTemp[
                wrongCharObject.value
              ].wrongInputs.length;
          } else {
            mergedWrongCharactersTemp[wrongCharObject.value] = {
              wrongInputs: wrongCharObject.userInputs,
              count: wrongCharObject.count,
            };
            mergedWrongCharactersTemp[wrongCharObject.value].count =
              mergedWrongCharactersTemp[
                wrongCharObject.value
              ].wrongInputs.length;
          }
        });
      });
      setMergedWrongCharacters(mergedWrongCharactersTemp);
    }
  }, [typingHistories]);
  useEffect(() => {
    if (mergedWrongCharacters) {
      console.log(mergedWrongCharacters);
    }
  }, [mergedWrongCharacters]);
  if (loading) {
    return <Loading />;
  }
  if (status === "unauthenticated") router.push("/login");

  let labels: string[] = [];
  let wrongCharCount: number[] = [];
  for (const char in mergedWrongCharacters) {
    // iterate object
    labels.push(char);
    wrongCharCount.push(mergedWrongCharacters[char].count);
  }
  // Sorting
  // Combine first
  const combinedArray = labels.map((label, index) => ({
    label,
    count: wrongCharCount[index],
  }));
  // Sort the combined array
  combinedArray.sort((a, b) => b.count - a.count);
  // Separate back to the original form
  labels = combinedArray.map((item) => item.label);
  wrongCharCount = combinedArray.map((item) => item.count);
  if (labels.length > 20) {
    // cut to max 20
    labels = labels.slice(0, 19);
    wrongCharCount = wrongCharCount.slice(0, 19);
  }
  const data = {
    labels,
    datasets: [
      {
        label: "Number of typos",
        data: wrongCharCount,
        backgroundColor: "#c7d2fe",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top 20 Innacurate Characters",
      },
      tooltip: {
        callbacks: {
          title: function (context: any) {
            const label = context[0].label;
            return `Character: ${label}`;
          },
          label: function (context: any) {
            const count = context.raw;
            return `Count: ${count}`;
          },
        },
      },
      onClick: (event: MouseEvent) => {
        console.log(event);
      },
    },
  };
  return (
    <>
      <Bar data={data} options={options} />
      <div className="flex self-center items-center justify-center text-indigo-700 bg-indigo-100 w-11/12 h-[6rem] rounded-xl ">
        Hover on each bar to see the insight&nbsp;
        <span className=" font-bold"> (Coming Soon!)</span>
        {hoveredChar && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              Tag Cloud for {hoveredChar}
            </h2>
            {/* <TagCloud
              minSize={15}
              maxSize={50}
              tags={mergedWrongCharacters[hoveredChar].wrongInputs.map(
                (input, index) => ({
                  value: input,
                  count: mergedWrongCharacters[hoveredChar].count,
                })
              )}
            /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default WrongCharStat;
