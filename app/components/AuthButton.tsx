"use client";
import React from "react";
import { getSession, signIn } from "next-auth/react";

const AuthButtonGoogle = () => {
  const handleClickGoogle = () => {
    signIn("google");
  };
  return (
    <button
      onClick={handleClickGoogle}
      className="flex justify-between items-center gap-2 border w-full border-gray-300 hover:border-gray-200 hover:bg-gray-50 bg-white rounded-lg  text-black py-2 px-3 hover:ring ring-gray-200 transition-all"
    >
      <img src="/icons/google.svg" className="w-7" alt="" />
      <div>Google</div>
      <div className="w-7"></div>
    </button>
  );
};

const AuthButtonGithub = () => {
  const handleClickGithub = () => {
    signIn("github");
  };
  return (
    <button
      onClick={handleClickGithub}
      className="flex justify-between items-center gap-2 border w-full border-[#1c2126] bg-[#24292f] rounded-lg  text-white py-2 px-3 hover:ring ring-gray-500 transition-all"
    >
      <img src="/icons/github-white.svg" className="w-7" alt="" />
      <div>GitHub</div>
      <div className="w-7"></div>
    </button>
  );
};
export { AuthButtonGoogle, AuthButtonGithub };
