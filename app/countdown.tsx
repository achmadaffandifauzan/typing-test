"use client";
import { useEffect, useState, useRef } from "react";
import { useTimer } from "react-timer-hook";
interface MyTimerProps {
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  triggerStart: boolean;
  setTriggerStart: React.Dispatch<React.SetStateAction<boolean>>;
  resetStates: Function;
  setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function MyTimer({
  setIsTimerRunning,
  triggerStart,
  setTriggerStart,
  resetStates,
  setIsFinished,
}: MyTimerProps) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60); // 60 seconds timer
  const { totalSeconds, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => {
      console.warn("onExpire called");
      resetStates();
      setIsFinished(true);
    },
  });
  useEffect(() => {
    if (triggerStart) {
      setIsFinished(false);
      restart(time);
      setIsTimerRunning(true);
      setTriggerStart(false);
    }
  }, [triggerStart]);
  return (
    <div className="text-center flex flex-row flex-wrap mt-2 gap-2">
      <div className="mt-3 flex">
        <div className="flex flex-col justify-center items-center transition-all rounded-xl  text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 w-32 py-2 px-4 h-20">
          <div>Timer</div>
          {(() => {
            if (isRunning) {
              return (
                <div className="font-semibold text-2xl text-green-600">
                  {totalSeconds}
                </div>
              );
            } else {
              return (
                <div className="font-semibold text-2xl text-red-600">
                  {totalSeconds}
                </div>
              );
            }
          })()}
        </div>
      </div>
      <div className="mt-3">
        {(() => {
          if (isRunning) {
            return (
              <button
                className="transition-all rounded-xl text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 w-32 py-2 px-4 h-20"
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
                className="transition-all rounded-xl text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 w-32 py-2 px-4 h-20"
                onClick={() => {
                  const time = new Date();
                  time.setSeconds(time.getSeconds() + 60);
                  setIsFinished(false);
                  restart(time);
                  setIsTimerRunning(true);
                }}
              >
                Start
              </button>
            );
          }
        })()}
      </div>
    </div>
  );
}
