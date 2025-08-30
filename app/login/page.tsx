"use client";
import Link from "next/link";
import { AuthButtonGoogle } from "../components/AuthButton";
import { AuthButtonGithub } from "../components/AuthButton";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Loading from "../components/Loading";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      setLoading(true);

      const response = await signIn("credentials", {
        username: data.get("username"),
        password: data.get("password"),
        redirect: false,
      });
      if (response?.status === 401) {
        throw new Error("Invalid credentials");
      } else if (response?.status !== 200) {
        throw new Error("Server error");
      }
      setLoading(false);
      toast.success(`Login success!, ${data.get("username")}!`, {
        duration: 2000,
      });
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      if (error.message === "Invalid credentials") {
        toast.error("Username or Password is wrong", {
          duration: 2000,
        });
      } else {
        toast.error("Server error. Please try again later!.", {
          duration: 2000,
        });
      }
    }
  };
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "authenticated") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [status, router]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="h-screen w-full flex flex-col flex-wrap justify-center items-center">
      <button
        onClick={() => router.back()}
        className="absolute top-12 left-16 w-fit py-2 px-4 bg-indigo-500 dark:bg-neutral-700 text-white hover:ring hover:ring-indigo-300  dark:hover:ring-neutral-900 rounded-lg self-start focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-amber-400 focus:bg-indigo-400 dark:focus:bg-neutral-600 transition"
      >
        Back
      </button>
      <div className="py-3 text-sm text-indigo-500 dark:text-neutral-300 font-bold">
        Login with:
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
          <div className="h-px rounded-lg w-full bg-indigo-500 dark:bg-neutral-600"></div>
          <div className=" text-indigo-500 dark:text-neutral-300 text-xs">
            or
          </div>
          <div className="h-px rounded-lg w-full bg-indigo-500 dark:bg-neutral-600"></div>
        </div>
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="username" className="">
            Username
          </label>
          <input
            className="border dark:bg-neutral-900 dark:border-neutral-800 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-neutral-600 transition"
            type="text"
            name="username"
            required
          />
        </div>
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            className="border dark:bg-neutral-900 dark:border-neutral-800 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-neutral-600 transition"
            type="password"
            name="password"
            required
          />
        </div>

        <button className="mt-3 py-2 w-full bg-indigo-500 dark:bg-neutral-700 text-white hover:ring hover:ring-indigo-300  dark:hover:ring-neutral-900 rounded-lg self-start focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-amber-400 focus:bg-indigo-400 dark:focus:bg-neutral-600 transition">
          Login
        </button>
        <Link
          href="/register"
          className="my-1 text-xs hover:text-indigo-600 dark:hover:text-neutral-600 transition"
        >
          Don&apos;t have account ? Register
        </Link>
      </form>
    </div>
  );
}
