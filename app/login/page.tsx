import Link from "next/link";

export default function Login() {
  return (
    <main>
      <div className="h-screen w-full flex flex-col flex-wrap justify-center items-center ">
        <div className="mb-5  font-bold">Login With : </div>
        <div className="flex flex-row gap-10 mb-5">
          <div className="border-2 border-emerald-600 bg-emerald-50 rounded-md  text-gray-500 py-2 px-2">
            Google
          </div>
          <div className="border-2 border-emerald-600 bg-emerald-50 rounded-md  text-gray-500 py-2 px-2">
            Github
          </div>
        </div>

        <form
          action=""
          className="flex flex-col flex-wrap justify-center items-center w-9/12 sm:w-3/12 "
        >
          <div className="flex flex-row w-full gap-2 items-center mb-5">
            <div className="h-px rounded-md w-full bg-gray-400"></div>
            <div className=" text-black">or</div>
            <div className="h-px rounded-md w-full bg-gray-400"></div>
          </div>
          <div className="mb-4 flex flex-col w-full">
            <label htmlFor="username" className="">
              Username or E-mail
            </label>
            <input
              className="border border-gray-400 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-emerald-400 transition"
              type="text"
              name="username"
              id=""
              required
            />
          </div>
          <div className="mb-4 flex flex-col w-full">
            <label htmlFor="password" className="">
              Password
            </label>
            <input
              className="border border-gray-400 rounded-md py-2 px-4  focus:outline-none focus:ring focus:ring-emerald-400 transition"
              type="password"
              name="password"
              id=""
              required
            />
          </div>

          <button className="mt-3 py-2 w-full bg-emerald-600 text-white hover:bg-emerald-700 rounded-md self-start focus:outline-none focus:ring focus:ring-emerald-400 transition">
            Login
          </button>
          <Link
            href="/register"
            className="my-2 text-sm hover:text-emerald-600 transition"
          >
            I do not have an account.
          </Link>
        </form>
      </div>
    </main>
  );
}
