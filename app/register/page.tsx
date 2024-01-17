"use client";
import Link from "next/link";
import { AuthButtonGoogle } from "../components/AuthButton";
import { AuthButtonGithub } from "../components/AuthButton";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RegisterPage() {
  const { data: session } = useSession();
  if (session) return redirect("/");
  return (
    <div className="h-screen w-full flex flex-col flex-wrap justify-center items-center">
      <div className="py-3 text-sm text-indigo-500 font-bold">
        Register with:
      </div>
      <div className="flex flex-col gap-2 mb-5 w-9/12 sm:w-3/12">
        <AuthButtonGoogle />
        <AuthButtonGithub />
      </div>
      <form
        action=""
        className="flex flex-col flex-wrap justify-center items-center w-9/12 sm:w-3/12 "
      >
        <div className="flex flex-row w-full gap-2 items-center mb-5">
          <div className="h-px rounded-lg w-full bg-indigo-500"></div>
          <div className=" text-indigo-500 text-xs">or</div>
          <div className="h-px rounded-lg w-full bg-indigo-500"></div>
        </div>
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="username" className="">
            Username or E-mail
          </label>
          <input
            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring focus:ring-indigo-200 transition"
            type="text"
            name="username"
            id="username"
            required
          />
        </div>
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            className="border border-gray-300 rounded-lg py-2 px-4  focus:outline-none focus:ring focus:ring-indigo-200 transition"
            type="password"
            name="password"
            id="password"
            required
          />
        </div>
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="re_password" className="">
            Repeat Password
          </label>
          <input
            className="border border-gray-300 rounded-lg py-2 px-4  focus:outline-none focus:ring focus:ring-indigo-200 transition"
            type="password"
            name="re_password"
            id="re_password"
            required
          />
        </div>

        <button className="mt-3 py-2 w-full bg-indigo-500 text-white hover:ring hover:ring-indigo-300 rounded-lg self-start focus:outline-none focus:ring focus:ring-indigo-300 focus:bg-indigo-400 transition">
          Register
        </button>
        <Link
          href="/login"
          className="my-1 text-xs hover:text-indigo-600 transition"
        >
          Already have account ? Login
        </Link>
      </form>
    </div>
  );
}
