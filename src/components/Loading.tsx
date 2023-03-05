import React, { CSSProperties, FC, PropsWithChildren } from "react";

const Loading: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        className="flex"
        style={{
          alignItems: "end",
          gap: "6px",
          height: "50px",
        }}
      >
        <div
          className="loadingBar"
          style={{
            maxHeight: "50%",
            animationName: "barHeight, barColor",
            animationDuration: "2s",
            animationTimingFunction: "ease-in",
          }}
        ></div>
        <div
          className="loadingBar"
          style={{
            maxHeight: "100%",
            animationName: "barHeight, barColor",
            animationDuration: "1.5s",
            animationTimingFunction: "ease-out",
          }}
        ></div>
        <div
          className="loadingBar"
          style={{
            maxHeight: "80%",
            animationName: "barHeight, barColor",
            animationDuration: "1.5s",
            animationTimingFunction: "cubic-bezier(0.25,0.1,0.25,1)",
          }}
        ></div>
      </div>

      <div style={{ marginTop: "1em" }}>{children}</div>
    </div>
  );
};

export default Loading;
