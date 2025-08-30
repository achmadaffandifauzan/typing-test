"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    try {
      signOut();
      return toast.success("Logout success!", {
        duration: 2000,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status, router]);

  if (loading) {
    return <Loading />;
  }
  const getAuthBtn = () => {
    if (session) {
      return (
        <div className="flex flex-row justify-between w-full gap-1 sm:bg-indigo-100 dark:sm:bg-neutral-800 rounded-b-xl">
          <button
            className="font-semibold flex flex-row sm:w-full min-w-max justify-center items-center h-10 sm:py-2 py-0.5 px-4 gap-1 z-10 bg-indigo-100 dark:bg-neutral-800 hover:bg-indigo-500 hover:text-white text-sm text-indigo-500 dark:text-neutral-300 sm:rounded-bl-xl max-sm:rounded-xl max-sm:ml-2  hover:ring-4 hover:shadow-xl transition-all"
            onClick={handleLogout}
          >
            <img src="/icons/logout.svg" className="sm:w-6 w-5" alt="" />
            <div>Logout</div>
          </button>
          <Link
            href={"/dashboard"}
            className="flex flex-row gap-1 z-10 px-4 min-w-max py-2 sm:bg-indigo-200 dark:sm:bg-neutral-800 bg-indigo-100 dark:bg-neutral-800 hover:bg-indigo-500 hover:text-white text-indigo-500 dark:text-neutral-300 sm:rounded-br-xl max-sm:rounded-xl max-sm:mr-2 hover:ring-4 hover:shadow-xl transition-all"
          >
            <img src="/icons/user.svg" className=" sm:w-6 w-5" alt="" />
            <div className="text-sm min-w-max flex justify-center items-center text-center">
              My Stats
            </div>
          </Link>
        </div>
      );
    } else {
      return (
        <Link
          href="/login"
          className="bg-indigo-100 dark:bg-neutral-800 hover:bg-indigo-500 hover:text-white text-indigo-500 dark:text-neutral-300 font-semibold flex flex-row items-center text-sm h-10 sm:py-2 py-0.5 px-3 sm:rounded-b-xl max-sm:rounded-xl hover:ring-4 hover:shadow-xl transition-all"
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
        <div className="absolute sm:top-5 sm:right-12 top-4 right-6 flex flex-col gap-2 justify-center sm:items-end max-sm:items-center max-sm:text-center ">
          <div className="flex flex-row">
            <div>
              Hi <span className="font-bold">{session?.user?.name}</span>!
            </div>
            <img src="/icons/waving-hand.svg" className="sm:w-7 w-5" alt="" />
          </div>
        </div>
      );
    }
  };
  return (
    <div className="w-full px-5 pt-4 pb-2 max-sm:pt-2 flex flex-row flex-wrap sm:justify-start justify-between items-center text-indigo-500 dark:text-neutral-300 ">
      <div className="max-sm:w-full rounded-xl sm:bg-indigo-200 dark:sm:bg-neutral-800 flex sm:flex-col flex-row flex-wrap justify-between items-center sm:absolute sm:top-5 ">
        <Link
          className="flex flex-row flex-wrap max-sm:ps-2 px-6 py-2 max-sm"
          href="/"
        >
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
