import { WebR } from "@r-wasm/webr";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StdContext } from "./StdContext";

type PromptState = "idle" | "queued" | "running";

type PromptObject = {
  name: string;
  canvas?: HTMLCanvasElement;
  script: string;
};

type PromptResult = {
  type: string;
  value: string;
};

interface IConsoleContext {
  state: { [key: string]: PromptState };
  results: { [key: string]: PromptResult[] };
  queue: PromptObject[];
  add: (object: PromptObject) => any;
}

export const ConsoleContext = createContext<IConsoleContext>({
  state: {},
  queue: [],
  results: {},
  add: () => {},
});

const TimeoutError = Symbol();

function timeout<T>(promise: Promise<T>, time: number): Promise<T> {
  let timer: number | undefined = undefined;

  const timeoutPromise = new Promise(
    (_r, rej) => (timer = setTimeout(rej, time, TimeoutError))
  );

  return Promise.race([promise, timeoutPromise]).finally(() =>
    clearTimeout(timer)
  ) as Promise<T>;
}

type Props = PropsWithChildren<{
  webR: WebR;
}>;

export const ConsoleContextProvider: FC<Props> = ({ children, webR }) => {
  const { addOutput } = useContext(StdContext);

  const [state, setState] = useState<IConsoleContext["state"]>({});
  const [results, setResults] = useState<IConsoleContext["results"]>({});
  const [queue, setQueue] = useState<IConsoleContext["queue"]>([]);
  const [updates, setUpdates] = useState(0);

  const add = (object: PromptObject) => {
    setState((prev) => ({ ...prev, [object.name]: "queued" }));
    setQueue((prev) => [...prev, object]);
    setUpdates((prev) => prev + 1);
  };

  const run = async () => {
    if (!queue[0] || state[queue[0].name] === "running") {
      return;
    }

    const { canvas, script, name } = queue[0];

    setState((prev) => {
      prev[name] = "running";
      return prev;
    });

    setResults((prev) => {
      prev[name] = [];
      return prev;
    });

    const context = canvas?.getContext("2d");

    if (context) {
      context.clearRect(0, 0, canvas!.width, canvas!.height);
    }

    await webR.writeConsole(script + "\n");

    let shouldBreak = false;
    let printed = false;
    let printedCanvas = false;

    console.log(`######### Processing ${script} ############`);

    while (true) {
      try {
        const read = await timeout(webR.read(), 500);

        // console.log("script", script);
        // console.log("WebR Message:", read);

        if (!read.data) {
          continue;
        }

        if (read.type === "canvasExec") {
          printedCanvas = true;
          Function(`this.${read.data}`).bind(context)();
          continue;
        }

        if (read.type === "stdout") {
          if (name === "console") {
            addOutput({ content: read.data, type: "out" });
          }

          setResults((prev) => {
            prev[name] = [
              ...(prev[name] || []),
              { type: "out", value: read.data },
            ];
            return prev;
          });

          printed = true;
        } else if (read.type === "stderr") {
          if (name === "console") {
            addOutput({ content: read.data, type: "error" });
          }

          setResults((prev) => {
            prev[name] = [
              ...(prev[name] || []),
              { type: "error", value: read.data },
            ];
            return prev;
          });

          printed = true;
        }

        if (read.type === "prompt") {
          if (canvas) {
            if (printedCanvas) {
              break;
            } else {
              continue;
            }
          }

          if (shouldBreak || printed) {
            break;
          }

          webR.writeConsole(script);

          shouldBreak = true;
        }
      } catch (err) {
        if (err !== TimeoutError) {
          console.error(err);
        } else {
          console.warn("timeout");
        }

        break;
      }
    }

    setState((prev) => {
      prev[name] = "idle";
      return prev;
    });

    setQueue((prev) => prev.slice(1));
    setUpdates((prev) => prev + 1);

    console.log(`######### Finished ${script} ############`);
  };

  useEffect(() => {
    run();
  }, [updates]);

  return (
    <ConsoleContext.Provider value={{ add, state, queue, results }}>
      {children}
    </ConsoleContext.Provider>
  );
};
