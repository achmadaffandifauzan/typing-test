import { useState, CSSProperties, useEffect } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useAppSelector } from "@/lib/hooks";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loading = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  let [color, setColor] = useState("#808df7");
  useEffect(() => {
    if (isDarkMode) {
      setColor("#d4d4d4");
    } else {
      setColor("#808df7");
    }
  }, [isDarkMode]);
  return (
    <div className="sweet-loading flex flex-wrap w-full h-screen justify-center items-center">
      <PropagateLoader
        color={color}
        loading={true}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
