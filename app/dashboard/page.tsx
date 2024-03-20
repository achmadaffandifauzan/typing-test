import React from "react";
import Header from "../header";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOneUser } from "@/prisma/functions/user";
import dayjs from "dayjs";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const user = await getOneUser(session?.user.username!);
  const userDateCreation = dayjs(user?.createdAt!.toString()).format(
    "MMM D, YYYY"
  );

  return (
    <div className="w-full sm:h-screen flex flex-col">
      <Header />
      <div className="flex flex-col sm:h-screen px-10">
        <div className="flex flex-row h-4/6 flex-wrap justify-between items-center sm:pt-20">
          <div className="w-3/12 bg-indigo-100 font-semibold text-indigo-500 px-4 py-3 rounded-xl text-center">
            <div>Name : {user?.name}</div>
            {session?.user.email && (
              <div>
                Email : <span>{session?.user.email}</span>
              </div>
            )}
            {user?.username && !session?.user.email && (
              <div>
                Username : <span>{user?.username}</span>
              </div>
            )}
            <div className="text-sm font-normal">
              User since {userDateCreation}
            </div>
          </div>
          <div className="w-8/12 bg-slate-100">Graph</div>
        </div>
        <div className="flex h-2/6 bg-slate-50">Keyboard</div>
      </div>
    </div>
  );
};

export default Dashboard;
