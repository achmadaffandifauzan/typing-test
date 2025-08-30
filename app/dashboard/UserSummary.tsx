import dayjs from "dayjs";
import React from "react";

const UserSummary = ({ user, session, typingHistories }: any) => {
  let userDateCreation = "Loading...";
  if (user) {
    userDateCreation = dayjs(user.createdAt!.toString()).format("MMM D, YYYY");
  }
  let wpm_avg = 0;
  let accuracy_avg = 0;
  if (user) {
    if (typingHistories) {
      wpm_avg =
        typingHistories.reduce(
          (total: any, history: any) => total + history.wpm,
          0
        ) / typingHistories.length;
      wpm_avg = Math.round((wpm_avg + Number.EPSILON) * 100) / 100;

      accuracy_avg =
        typingHistories.reduce(
          (total: any, history: any) => total + history.accuracy,
          0
        ) / typingHistories.length;
      accuracy_avg = Math.round((accuracy_avg + Number.EPSILON) * 100) / 100;
    }
  }
  const userInfoDisplay = () => {
    return (
      <>
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
        <div className="text-sm font-normal">User since {userDateCreation}</div>
      </>
    );
  };
  const averageWpmDisplay = () => {
    return (
      <>
        <div className="text-sm">Average WPM</div>
        <div className="text-xl">
          <span className="text-3xl font-bold">
            {wpm_avg.toString().split(".")[0]}
          </span>
          <span className="font-bold text-2xl">.</span>
          <span>
            {wpm_avg.toString().split(".")[1]
              ? wpm_avg.toString().split(".")[1]
              : "00"}
          </span>
        </div>
      </>
    );
  };
  const averageAccuracyDisplay = () => {
    return (
      <>
        <div className="text-sm">Average Accuracy</div>
        <div className="text-xl">
          <span className="text-3xl font-bold">
            {accuracy_avg.toString().split(".")[0]}
          </span>
          <span className="font-bold text-2xl">.</span>
          <span>
            {accuracy_avg.toString().split(".")[1]
              ? accuracy_avg.toString().split(".")[1]
              : "00"}
          </span>
          <span>%</span>
        </div>
      </>
    );
  };
  return (
    <div className="flex sm:flex-row flex-col flex-wrap justify-around items-center sm:pt-28">
      <div className="sm:w-2/12 h-24 flex flex-col flex-wrap justify-center items-center bg-indigo-100 dark:bg-indigo-900 font-semibold text-indigo-500 dark:text-indigo-300 px-4 py-3 rounded-xl gap-1">
        {averageWpmDisplay()}
      </div>

      <div className="sm:w-4/12 h-24 flex flex-col flex-wrap justify-center items-center bg-indigo-100 dark:bg-indigo-900 font-semibold text-indigo-500 dark:text-indigo-300 px-4 py-3 rounded-xl ">
        {userInfoDisplay()}
      </div>

      <div className="sm:w-2/12 h-24 flex flex-col flex-wrap justify-center items-center bg-indigo-100 dark:bg-indigo-900 font-semibold text-indigo-500 dark:text-indigo-300 px-4 py-3 rounded-xl gap-1">
        {averageAccuracyDisplay()}
      </div>
    </div>
  );
};

export default UserSummary;
