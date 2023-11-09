import { useState, CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loading = () => {
  let [color, setColor] = useState("#808df7");

  return (
    <div className="sweet-loading flex flex-wrap w-full h-screen justify-center items-center">
      <SyncLoader
        color={color}
        loading={true}
        cssOverride={override}
        size={20}
        margin={5}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
