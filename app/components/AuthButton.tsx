"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AuthButtonGoogle = () => {
  const router = useRouter();

  const handleClickGoogle = () => {
    try {
      signIn("google");
      return toast.info("Please wait!", {
        duration: 2000,
      });
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
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
  const router = useRouter();

  const handleClickGithub = () => {
    try {
      signIn("github");
      return toast.info("Please wait!", {
        duration: 2000,
      });
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
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
