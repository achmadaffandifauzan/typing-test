import React from "react";
import Header from "../header";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOneUser } from "@/prisma/functions/user";
import dayjs from "dayjs";
import LineChart from "./lineChart";
import { getTypingHistories } from "@/prisma/functions/typing";
const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const user = await getOneUser(session?.user.username!);
  const userDateCreation = dayjs(user?.createdAt!.toString()).format(
    "MMM D, YYYY"
  );
  const typingHistories = await getTypingHistories(user?.username);
  // console.log("typingHistories", typingHistories);
  // change typing format to be chart data

  const labels: any = typingHistories?.map((typing) => {
    return dayjs(typing.createdAt.toString()).format("D/MM/YY");
  });
  const accuracyChartData: any = {
    label: "Accuracy",
    data: typingHistories?.map((typing) => {
      return typing.accuracy;
    }),
    borderColor: "#37a345",
    backgroundColor: "#37a345",
  };
  const wpmChartData: any = {
    label: "WPM",
    data: typingHistories?.map((typing) => {
      return typing.wpm;
    }),
    borderColor: "#d1221f",
    backgroundColor: "#d1221f",
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col px-5">
        <div className="flex sm:flex-row flex-col flex-wrap justify-around items-center sm:pt-20 ">
          <div className="sm:w-3/12 bg-indigo-100 font-semibold text-indigo-500 px-4 py-3 rounded-xl text-center">
            {user?.name && (
              <div>
                <div>Name : {user?.name}</div>
              </div>
            )}
            {session?.user.email && (
              <div>
                Email : <span>{session?.user.email}</span>
              </div>
            )}
            {user?.username && !session?.user.email && (
              <div>
                Username : <span>{user?.username}</span>
              </div>
            )}
            <div className="text-sm font-normal">
              User since {userDateCreation}
            </div>
          </div>
          <div className="sm:w-6/12 bg-indigo-100 rounded-xl sm:p-4 p-1 flex justify-start items-center">
            <LineChart
              accuracyChartData={accuracyChartData}
              wpmChartData={wpmChartData}
              labels={labels}
            ></LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
