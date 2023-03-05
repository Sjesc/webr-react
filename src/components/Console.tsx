import { WebR } from "@r-wasm/webr";
import React, {
  FC,
  HTMLProps,
  KeyboardEvent,
  useCallback,
  useContext,
  useState,
} from "react";
import { ConsoleContext } from "../context/ConsoleContext";
import { StdContext } from "../context/StdContext";
import Code from "./Code";

type Props = HTMLProps<HTMLInputElement> & {
  name?: string;
  webR: WebR;
};

const Console: FC<Props> = ({ name, webR, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { add } = useContext(ConsoleContext);
  const { output, addOutput } = useContext(StdContext);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const { code } = e;

    if (code === "Enter") {
      addOutput({ content: `> ${input.value}`, type: "out" });
      add({ name: "console", script: input.value });
      input.value = "";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        marginBlockEnd: 0,
        zIndex: 10,
        opacity: 0.85,
        transform: `translateY(${!isOpen ? "300px" : 0})`,
        transition: "0.5s",
      }}
    >
      <button
        style={{ boxShadow: "none", marginBlockEnd: 0 }}
        onClick={setIsOpen.bind(null, !isOpen)}
      >
        Console
      </button>

      <Code
        style={{
          boxShadow: "none",
          height: "300px",
          width: "100%",
          marginBottom: 0,
        }}
      >
        <code
          className="code"
          style={{ padding: 0, opacity: 0.7, background: "transparent" }}
        >
          {output.map(({ content, type }, i) => {
            return (
              <div
                className="code-line"
                key={i}
                style={{
                  padding: 0,
                  color: type === "error" ? "red" : "inherit",
                  marginBlockEnd: "0.6em",
                }}
              >
                {content}
              </div>
            );
          })}
        </code>
        <div className="flex flex-center">
          <span
            style={{
              fontSize: "0.95rem",
              opacity: 0.8,
              marginBlockEnd: 0,
              marginRight: "0.5em",
              lineHeight: 0,
            }}
          >
            &gt;
          </span>
          <input
            className="code"
            style={{ padding: 0 }}
            {...props}
            onKeyDown={onKeyDown}
          ></input>
        </div>
      </Code>
    </div>
  );
};

export default Console;
