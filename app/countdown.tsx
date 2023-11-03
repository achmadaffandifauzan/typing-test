"use client";
import { useEffect, useState, useRef } from "react";
import { useTimer } from "react-timer-hook";
interface MyTimerProps {
  setIsTimerRunning: Function;
  triggerStart: Boolean;
  setTriggerStart: Function;
}
export default function MyTimer({
  setIsTimerRunning,
  triggerStart,
  setTriggerStart,
}: MyTimerProps) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60); // 60 seconds timer
  const { totalSeconds, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => {
      setIsTimerRunning(false);
      console.warn("onExpire called");
    },
  });
  useEffect(() => {
    if (triggerStart) {
      restart(time);
      setIsTimerRunning(true);
      setTriggerStart(false);
    }
  }, [triggerStart]);
  return (
    <div className="text-center">
      <div>Timer</div>
      {(() => {
        if (isRunning) {
          return (
            <div className="font-semibold text-2xl text-green-700">
              {totalSeconds}
            </div>
          );
        } else {
          return (
            <div className="font-semibold text-2xl text-red-700">
              {totalSeconds}
            </div>
          );
        }
      })()}
      <div className="my-3">
        {(() => {
          if (totalSeconds < 59) {
            return (
              <button
                className="transition-all rounded-xl py-2 px-4 text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 mx-2 w-32"
                onClick={() => {
                  const time = new Date();
                  time.setSeconds(time.getSeconds() + 60);
                  restart(time);
                  setIsTimerRunning(false);
                  pause();
                }}
              >
                Reset
              </button>
            );
          } else {
            return (
              <button
                className="transition-all rounded-xl py-2 px-4 text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 mx-2 w-32"
                onClick={() => {
                  const time = new Date();
                  time.setSeconds(time.getSeconds() + 60);
                  restart(time);
                  setIsTimerRunning(true);
                }}
              >
                Start
              </button>
            );
          }
        })()}
        {(() => {
          if (isRunning) {
            return (
              <button
                className="transition-all rounded-xl py-2 px-4 text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 mx-2 w-32"
                onClick={() => {
                  setIsTimerRunning(false);
                  pause();
                }}
              >
                Pause
              </button>
            );
          } else if (!isRunning && totalSeconds < 60) {
            return (
              <button
                className="transition-all rounded-xl py-2 px-4 text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 mx-2 w-32"
                onClick={() => {
                  setIsTimerRunning(true);
                  resume();
                }}
              >
                Resume
              </button>
            );
          }
        })()}
      </div>
    </div>
  );
}
