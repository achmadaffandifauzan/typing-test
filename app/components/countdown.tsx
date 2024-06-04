"use client";
import { useAppDispatch } from "@/lib/hooks";
import { userFinishTyping, userStartTyping } from "@/lib/store";
import { useEffect } from "react";
import { useTimer } from "react-timer-hook";
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
      <div className="flex flex-col justify-center items-center transition-all rounded-xl  text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 w-32 sm:py-2 px-4  max-sm:flex-row max-sm:justify-around">
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
      {(() => {
        if (isRunning) {
          return (
            <button
              className="transition-all rounded-xl text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 w-32 sm:py-2 px-4 "
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
              className="transition-all rounded-xl text-center  bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  focus:outline-none focus:ring focus:ring-indigo-300 w-32 py-2 px-4 "
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
