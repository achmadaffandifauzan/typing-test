import React, { useEffect, useState } from "react";
import { toggleTheme } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const ToggleTheme = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    document.documentElement.classList[isDarkMode ? "add" : "remove"]("dark");
  }, [isDarkMode]);

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={(e) => dispatch(toggleTheme(e.target.checked))}
        className="sr-only peer"
      />
      <div className="relative w-14 h-7 bg-indigo-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-indigo-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-grey-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-indigo-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
      <span className="ms-3 text-sm font-medium">Dark Mode</span>
    </label>
  );
};

export default ToggleTheme;
