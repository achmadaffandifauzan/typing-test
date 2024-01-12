"use client";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  const getAuthBtn = () => {
    if (session) {
      return (
        <div className="flex flex-row px-7">
          <div className="flex flex-col justify-center items-start">
            <div>Hi {session?.user?.name?.split(" ")[0]}! </div>
            <button className="px-2 " onClick={() => signOut()}>
              Logout
            </button>
          </div>
          <img className="sm:w-9 w-5" src="/icons/waving-hand.svg" alt="" />
        </div>
      );
    } else {
      return (
        <button
          className="bg-indigo-100 hover:bg-indigo-500 hover:text-white text-indigo-500 font-semibold flex flex-row items-center text-sm h-10 sm:py-2 py-0.5 px-3 sm:rounded-b-xl rounded-r-none hover:ring-4 hover:shadow-xl transition-all"
          onClick={() => signIn()}
        >
          <img src="/icons/login.svg" className="sm:w-6 w-5" alt="" />
          <div>Login to save result!</div>
        </button>
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
    </div>
  );
};

export default Header;
