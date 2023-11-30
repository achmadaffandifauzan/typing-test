import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full px-5 sm:pt-4 flex flex-row flex-wrap sm:justify-start justify-center items-center text-indigo-500 max-sm:bg-indigo-200">
      <Link
        className="rounded-xl bg-indigo-200 flex flex-row flex-wrap justify-center items-center px-3 py-2 sm:absolute sm:top-5"
        href="/"
      >
        <img src="/icons/keyboard.svg" className="w-5" alt="" />
        <div className="font-bold">TypingTest</div>
      </Link>
    </div>
  );
};

export default Header;
