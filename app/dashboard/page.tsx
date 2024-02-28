import React from "react";
import Header from "../header";
const Dashboard = () => {
  return (
    <div className="w-full sm:h-screen flex flex-col">
      <Header />
      <div className="flex flex-col sm:h-screen px-10">
        <div className="flex flex-row h-4/6 flex-wrap justify-between items-center sm:pt-20">
          <div className="w-4/12">Your Profile</div>
          <div className="w-6/12">Graph</div>
        </div>
        <div className="flex h-2/6">Keyboard</div>
      </div>
    </div>
  );
};

export default Dashboard;
