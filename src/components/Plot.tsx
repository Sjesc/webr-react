import { FC, useCallback, useContext } from "react";
import { ConsoleContext } from "../context/ConsoleContext";
import Loading from "./Loading";

interface PlotProps {
  name: string;
  updates: number;
  script: string;
  scale?: number;
}

const Plot: FC<PlotProps> = ({ script, updates, scale = 0.5, name }) => {
  const { add, state } = useContext(ConsoleContext);

  const onCanvasRender = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        add({ canvas, script, name });
      }
    },
    [script, updates]
  );

  const canvasState = state[name];

  return (
    <div
      className="flex flex-center relative"
      style={{ width: 1000 * scale, height: 1000 * scale }}
    >
      {canvasState !== "idle" && (
        <div
          className="absolute w-full h-full flex flex-center"
          style={{ background: `rgba(255, 255, 255, 0.75)`, zIndex: 1 }}
        >
          <Loading>Generating plot...</Loading>
        </div>
      )}

      <canvas
        style={{
          transform: `scale(${scale})`,
        }}
        id="canvas"
        ref={onCanvasRender}
        width={1000}
        height={1000}
      ></canvas>
    </div>
  );
};

export default Plot;
