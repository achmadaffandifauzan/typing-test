import React from "react";

const footer = () => {
  return (
    <div className="w-full min-h-max sm:py-1.5 py-8 bg-indigo-50 flex sm:flex-row flex-col gap-3 flex-wrap items-center sm:justify-between  sm:px-10 text-sm">
      <div>
        <div>&copy; Achmad Affandi Fauzan 2023</div>
        <div></div>
      </div>
      <a
        className="flex flex-row flex-wrap items-center gap-2 rounded-xl  bg-indigo-200 hover:bg-indigo-300 active:bg-indigo-300  focus:outline-none focus:ring focus:ring-indigo-400 py-1.5 px-2"
        href="https://github.com/achmadaffandifauzan/typing-test"
        target="_blank"
      >
        <div>Source Code </div>
        <img src="/icons/github.svg" className="w-5" alt="" />
      </a>
      <div className="flex flex-row flex-wrap justify-center items-center bg-indigo-200 rounded-xl py-1.5 ps-3 pe-2">
        <span className="">My Socials</span>
        <a
          href="https://github.com/achmadaffandifauzan"
          className="mx-2 "
          target="_blank"
        >
          <img width="25px" src="/icons/github.svg" alt="" />
        </a>
        <a
          href="https://www.linkedin.com/in/achmad-affandi-fauzan"
          className="mx-2 "
          target="_blank"
        >
          <img width="25px" src="/icons/linkedin.svg" alt="" />
        </a>
        <a
          href="https://www.instagram.com/achmadaffandifauzan/"
          className="mx-2 "
          target="_blank"
        >
          <img width="25px" src="/icons/instagram.svg" alt="" />
        </a>
        <a
          href="https://twitter.com/aaffandif"
          className="mx-2 "
          target="_blank"
        >
          <img width="25px" src="/icons/twitter.svg" alt="" />
        </a>
      </div>
    </div>
  );
};

export default footer;
