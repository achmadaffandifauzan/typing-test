import React from "react";
import Header from "../components/Header";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { getOneUser } from "@/prisma/functions/user";
import dayjs from "dayjs";
import { AccuracyLineChart, WpmLineChart } from "./lineChart";
import { getTypingHistories } from "@/prisma/functions/typing";
import UpperContent from "./UpperContent/UpperContent";
import { Prisma } from "@prisma/client";
const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const user = await getOneUser(session?.user.username!);
  const typingHistories = await getTypingHistories(user?.username);

  // console.log("typingHistories", typingHistories);

  // change typing format to be chart data
  const labels: any = typingHistories?.map((typing: any) => {
    return dayjs(typing.createdAt.toString()).format("D MMM");
  });
  const accuracyChartData: any = {
    label: "Accuracy",
    data: typingHistories?.map((typing: any) => {
      return typing.accuracy;
    }),
    borderColor: "rgb(31,209,167,0.7)",
    backgroundColor: "rgb(31,209,167,0.8)",
  };
  const wpmChartData: any = {
    label: "WPM",
    data: typingHistories?.map((typing: any) => {
      return typing.wpm;
    }),
    borderColor: "rgb(209,78,31,0.7",
    backgroundColor: "rgb(209,78,31,0.8)",
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col px-5">
        <UpperContent
          user={user}
          session={session}
          typingHistories={typingHistories}
        ></UpperContent>
        <div className="flex flex-col flex-wrap justify-around items-center sm:pt-9 sm:gap-8">
          <div className="sm:w-10/12 w-full bg-indigo-100 rounded-xl flex justify-start items-center">
            <AccuracyLineChart
              accuracyChartData={accuracyChartData}
              labels={labels}
            ></AccuracyLineChart>
          </div>
          <div className="sm:w-10/12 w-full bg-indigo-100 rounded-xl flex justify-start items-center">
            <WpmLineChart
              wpmChartData={wpmChartData}
              labels={labels}
            ></WpmLineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
