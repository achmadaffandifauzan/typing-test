"use client";
import { useState } from "react";
import Link from "next/link";
import { AuthButtonGoogle } from "../components/AuthButton";
import { AuthButtonGithub } from "../components/AuthButton";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface CredentialsFormProps {
  csrfToken?: string;
}

export default function RegisterPage(props: CredentialsFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    if (data.get("password") !== data.get("re_password")) {
      return toast.error("Passwords do not match. Please try again.", {
        duration: 2000,
      });
    }
    try {
      const registerResponseJSON = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.get("username"),
          password: data.get("password"),
        }),
      });
      if (registerResponseJSON.status == 200) {
        // const registerResponse = await registerResponseJSON.json();
        // console.log(registerResponse);

        // Log in the user after successful registration
        const loginResponse = await signIn("credentials", {
          username: data.get("username"),
          password: data.get("password"),
          redirect: false,
          callbackUrl: `${window.location.origin}/`,
        });
        console.log(loginResponse);
        return loginResponse;
      }
    } catch (error) {
      console.log("Error: ", error);
      return toast.error("Error. Please try again.", {
        duration: 2000,
      });
    }
  };
  if (session) router.push("/");
  return (
    <div className="h-screen w-full flex flex-col flex-wrap justify-center items-center">
      {props.csrfToken}
      <div className="py-3 text-sm text-indigo-500 font-bold">
        Register with:
      </div>
      <div className="flex flex-col gap-2 mb-5 w-9/12 sm:w-3/12">
        <AuthButtonGoogle />
        <AuthButtonGithub />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-wrap justify-center items-center w-9/12 sm:w-3/12 "
      >
        <div className="flex flex-row w-full gap-2 items-center mb-5">
          <div className="h-px rounded-lg w-full bg-indigo-500"></div>
          <div className=" text-indigo-500 text-xs">or</div>
          <div className="h-px rounded-lg w-full bg-indigo-500"></div>
        </div>
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="username" className="">
            Username
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
