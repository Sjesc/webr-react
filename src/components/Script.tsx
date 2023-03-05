import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { WebR } from "@r-wasm/webr";
import { cleanScript } from "../helpers";
import Code from "./Code";
import Loading from "./Loading";
import { ConsoleContext } from "../context/ConsoleContext";
import DataFrame from "./DataFrame";
import Plot from "./Plot";
import Editor from "react-simple-code-editor";

import hljs from "highlight.js";
import r from "highlight.js/lib/languages/r";
hljs.registerLanguage("r", r);

interface ScriptProps {
  script: string;
  webR: WebR;
}

const Script: FC<ScriptProps> = ({ script, webR }) => {
  const [scriptSent, setScriptSent] = useState<string | null>(null);
  const [scriptValue, setScriptValue] = useState(script.trim());
  const [dataFrame, setDataframe] = useState<string | null>(null);
  const [plot, setPlot] = useState<string | null>(null);

  const { results, add } = useContext(ConsoleContext);

  const run = () => {
    setScriptSent(scriptValue);
    add({
      name: scriptValue,
      script: cleanScript(scriptValue),
    });
  };

  const displayDataFrame = () => {
    setDataframe(scriptValue);
  };

  const displayPlot = () => {
    setPlot(scriptValue);
  };

  const scriptResults = results[scriptSent ?? ""];

  const isLoading = !scriptResults || !scriptResults.length;

  const CodeOutput = () => {
    return (
      <>
        <div
          style={{
            marginTop: "0.5em",
            borderBottom: "1px solid hsl(var(--primary) / 10%)",
          }}
        ></div>
        {scriptResults.map(({ value, type }, i) => (
          <div
            key={i}
            className="code-line"
            style={{
              marginBlockEnd: "0.5em",
              color: type === "error" ? "red" : "inherit",
            }}
          >
            {value}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="relative">
      <div
        className="absolute flex flex-center"
        style={{ zIndex: 1, top: "1em", right: "1em", gap: "8px" }}
      >
        <button onClick={run}>Run</button>
        <button className="green" onClick={displayDataFrame}>
          DataFrame
        </button>
        <button onClick={displayPlot} className="red">
          Plot
        </button>
      </div>

      <Code>
        <Editor
          value={scriptValue}
          onValueChange={(code) => setScriptValue(code)}
          highlight={(code) => (
            <span
              dangerouslySetInnerHTML={{
                __html: hljs.highlight("r", code).value,
              }}
            ></span>
          )}
          padding={10}
        />

        {!!scriptSent && (
          <>
            {isLoading && <Loading>Running script...</Loading>}
            {!isLoading && <CodeOutput />}
          </>
        )}
      </Code>

      {dataFrame && <DataFrame webR={webR} dataframe={dataFrame} updates={0} />}

      {plot && <Plot name={plot} updates={0} script={plot} />}
    </div>
  );
};

export default Script;
