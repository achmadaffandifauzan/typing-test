"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  const getAuthBtn = () => {
    if (session) {
      return (
        <button
          className="bg-indigo-100 hover:bg-indigo-500 hover:text-white text-indigo-500 font-semibold flex flex-row sm:w-full justify-center items-center text-sm h-10 sm:py-2 py-0.5 px-3 rounded-b-xl hover:ring-4 hover:shadow-xl transition-all gap-1"
          onClick={() => signOut()}
        >
          <div>Logout</div>
          <img src="/icons/logout.svg" className="sm:w-6 w-5" alt="" />
        </button>
      );
    } else {
      return (
        <Link
          href="/login"
          className="bg-indigo-100 hover:bg-indigo-500 hover:text-white text-indigo-500 font-semibold flex flex-row items-center text-sm h-10 sm:py-2 py-0.5 px-3 sm:rounded-b-xl max-sm:rounded-r-none max-sm:rounded-l-xl hover:ring-4 hover:shadow-xl transition-all"
        >
          <img src="/icons/login.svg" className="sm:w-6 w-5" alt="" />
          <div>Login to save result!</div>
        </Link>
      );
    }
  };
  const displayGreeting = () => {
    if (session) {
      return (
        <div className="absolute sm:top-5 sm:right-12 right-28 flex flex-row gap-2 justify-center items-center max-sm:text-center ">
          <div>
            Hi <span className="font-bold">{session?.user?.name}</span>!
          </div>
          <img src="/icons/waving-hand.svg" className="sm:w-7 w-5" alt="" />
        </div>
      );
    }
  };
  return (
    <div className="w-full sm:px-5 sm:pt-4 flex flex-row flex-wrap sm:justify-start justify-between items-center text-indigo-500 max-sm:bg-indigo-200">
      <div className="max-sm:w-full rounded-xl bg-indigo-200 flex sm:flex-col flex-row flex-wrap justify-between items-center sm:absolute sm:top-5 ">
        <Link className="flex flex-row flex-wrap px-6 py-2 " href="/">
          <img src="/icons/keyboard.svg" className="w-5" alt="" />
          <div className="font-bold">TypingTest</div>
        </Link>
        {getAuthBtn()}
      </div>
      {displayGreeting()}
    </div>
  );
};

export default Header;
