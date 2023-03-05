import { WebR } from "@r-wasm/webr";
import { KeyboardEvent, useEffect, useState } from "react";
import Plot from "./components/Plot";
import Code from "./components/Code";
import Console from "./components/Console";
import DataFrame from "./components/DataFrame";
import Heading from "./components/Heading";
import Loading from "./components/Loading";
import Script from "./components/Script";
import { ConsoleContextProvider } from "./context/ConsoleContext";
import { StdContextProvider } from "./context/StdContext";
import { cleanScript } from "./helpers";

import hljs from "highlight.js";
import r from "highlight.js/lib/languages/r";
hljs.registerLanguage("r", r);

import setupR from "./scripts/setup.R?raw";
import summaryR from "./scripts/summary.R?raw";
import Editor from "react-simple-code-editor";

const webR = new WebR({
  REnv: {
    R_HOME: "/usr/lib/R",
    R_ENABLE_JIT: "0",
    R_DEFAULT_DEVICE: "canvas",
  },
});

function App() {
  const [loadingMessage, setLoadingMessage] = useState<string | null>(
    "Loading WebR... This might take a few minutes if it is the first time you load this page"
  );

  const [scripts, setScripts] = useState(0);

  const [updates, setUpdates] = useState(0);

  const startWebR = async () => {
    await webR.init();

    // setLoadingMessage("Installing packages...");
    // await webR.installPackages(["ggplot2"]);

    setLoadingMessage("Running setup script...");

    await webR.evalR(cleanScript(setupR));

    setLoadingMessage(null);
  };

  // const onKeyDown = async (ev: KeyboardEvent<HTMLInputElement>) => {
  //   if (ev.code === "Enter") {
  //     const input = ev.target as HTMLInputElement;
  //     consoleR.stdin(input.value);
  //     input.value = "";
  //     await consoleR.stdin("plot(data)");
  //   }
  // };

  const updateData = async () => {
    setUpdates((prev) => prev + 1);
  };

  useEffect(() => {
    startWebR();
  }, []);

  return (
    <main>
      <StdContextProvider>
        <ConsoleContextProvider webR={webR}>
          {loadingMessage && <Loading>{loadingMessage}</Loading>}
          {!loadingMessage && (
            <div>
              <Heading>R Setup</Heading>

              <p>
                This code was ran before rendering the page. The R enviroment is
                shared between all scripts, so these variables can be used in
                other scripts
              </p>

              <Code name="setup.r">
                <div
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlight("r", setupR).value,
                  }}
                ></div>
              </Code>

              <Console name="Console" webR={webR}></Console>

              <br />
              <br />

              <Heading>Console</Heading>

              <p>
                In the bottom left corner, you can click on the{" "}
                <span className="bold" style={{ color: "hsl(var(--blue))" }}>
                  Console
                </span>{" "}
                button to display the R console
              </p>

              <br />
              <br />

              <Heading>Scripts</Heading>

              <p>
                The scripts are editable. After every (except the last one)
                statement a semicolon (<b>;</b>) is needed because of how the
                input is sent.
              </p>

              <p>
                Edit "modl" to "model" and click on the{" "}
                <span className="bold" style={{ color: "hsl(var(--blue))" }}>
                  Run
                </span>{" "}
                button to run this code.
              </p>

              <Script
                webR={webR}
                script={`model <- lm(x ~ y, data);\nsummary(modl)`}
              />

              {[...Array(scripts)].map((_, i) => (
                <Script webR={webR} script="" key={i}></Script>
              ))}

              <button onClick={() => setScripts((prev) => prev + 1)}>
                Add script
              </button>

              <br />
              <br />
              <br />
              <br />

              <Heading style={{ marginBottom: "1em" }}>Dataframes</Heading>

              <DataFrame
                dataframe="data"
                webR={webR}
                updates={updates}
              ></DataFrame>

              <p>
                The{" "}
                <span className="bold" style={{ color: "hsl(var(--green))" }}>
                  DataFrame
                </span>{" "}
                button can be used to display DataFrames with HTML
              </p>

              <Script
                webR={webR}
                script={`merge(data, data2, by="id")`}
              ></Script>

              <br />
              <br />
              <br />

              <Heading>Plots</Heading>
              <br />

              <Plot name="plot1" script="plot(data)" updates={updates} />

              <p>
                The{" "}
                <span className="bold" style={{ color: "hsl(var(--red))" }}>
                  Plot
                </span>{" "}
                button can be used to display plots.
              </p>

              <Script
                webR={webR}
                script={`plot(data2)\ntitle("Rendering plots with R in the browser", line = 3)`}
              />

              <div style={{ marginTop: "2em" }}>
                <p>Made by Silvino Escalona</p>
                <p>
                  R execution powered by{" "}
                  <a href="https://github.com/georgestagg/webR" target="_blank">
                    WebR
                  </a>
                </p>
                <p>
                  Hosted on{" "}
                  <a href="https://www.netlify.com/" target="_blank">
                    Netlify
                  </a>
                </p>
              </div>
            </div>
          )}
        </ConsoleContextProvider>
      </StdContextProvider>
    </main>
  );
}

export default App;
