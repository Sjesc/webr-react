import { WebR } from "@r-wasm/webr";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

interface IStdOutput {
  type: "out" | "error";
  content: string;
}

interface IStdContext {
  output: IStdOutput[];
  addOutput: (output: IStdOutput) => any;
}

export const StdContext = createContext<IStdContext>({
  output: [],
  addOutput: () => {},
});

type Props = PropsWithChildren<{}>;

export const StdContextProvider: FC<Props> = ({ children }) => {
  const [output, setOutput] = useState<IStdContext["output"]>([]);

  const addOutput = (output: IStdOutput) => {
    setOutput((prev) => [...prev, output]);
  };

  return (
    <StdContext.Provider value={{ output, addOutput }}>
      {children}
    </StdContext.Provider>
  );
};
