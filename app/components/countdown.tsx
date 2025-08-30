"use client";
import { useAppDispatch } from "@/lib/hooks";
import {
  setTriggerSaveResult,
  userFinishTyping,
  userStartTyping,
} from "@/lib/store";
import { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import ToggleTheme from "./ToggleTheme";

interface MyTimerProps {
  triggerStartTime: boolean;
  setTriggerStartTime: React.Dispatch<React.SetStateAction<boolean>>;
  resetStates: Function;
}
export default function MyTimer({
  triggerStartTime,
  setTriggerStartTime,
  resetStates,
}: MyTimerProps) {
  const dispatch = useAppDispatch();
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60); // 60 seconds timer
  const { totalSeconds, isRunning, restart } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => {
      console.warn("onExpire called");
      dispatch(userFinishTyping());
      // only save attempt to db only after timer is expired
      dispatch(setTriggerSaveResult({ trigger: "on" }));
      resetStates();
    },
  });
  useEffect(() => {
    if (triggerStartTime) {
      restart(time);
      dispatch(userStartTyping());
      setTriggerStartTime(false);
    }
  }, [triggerStartTime]);
  return (
    <div className="text-center flex flex-row flex-wrap gap-2 sm:h-20 h-10">
      <div className="flex flex-col justify-center items-center transition-all rounded-xl  text-center  bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 active:bg-indigo-200 dark:active:bg-indigo-800  focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700 w-32 sm:py-2 px-4  max-sm:flex-row max-sm:justify-around">
        <div>Timer</div>
        {(() => {
          if (isRunning) {
            return (
              <div
                id="timer-countdown"
                className="font-semibold text-2xl text-green-600"
              >
                {totalSeconds}
              </div>
            );
          } else {
            return (
              <div
                id="timer-countdown"
                className="font-semibold text-2xl text-red-600"
              >
                {totalSeconds}
              </div>
            );
          }
        })()}
      </div>
      {(() => {
        if (isRunning) {
          return (
            <button
              id="reset-button"
              className="transition-all rounded-xl text-center  bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 active:bg-indigo-200 dark:active:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700 w-32 sm:py-2 px-4 "
              onClick={() => {
                resetStates();
              }}
            >
              Reset
            </button>
          );
        } else {
          return (
            <button
              id="start-button"
              className="transition-all rounded-xl text-center  bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 active:bg-indigo-200 dark:active:bg-indigo-800 focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-indigo-700 w-32 py-2 px-4 "
              onClick={() => {
                const time = new Date();
                time.setSeconds(time.getSeconds() + 60);
                restart(time);
                dispatch(userStartTyping());
              }}
            >
              Start
            </button>
          );
        }
      })()}
    </div>
  );
}
