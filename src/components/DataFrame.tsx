import { WebR } from "@r-wasm/webr";
import React, { FC, useEffect, useState } from "react";
import Loading from "./Loading";

interface DataFrameProps {
  webR: WebR;
  dataframe: string;
  updates: number;
}

const DataFrame: FC<DataFrameProps> = ({ webR, dataframe, updates }) => {
  const [colnames, setColnames] = useState<string[]>([]);
  const [rownames, setRownames] = useState<string[]>([]);
  const [data, setData] = useState<any[][]>([]);

  const fetchData = async () => {
    const colnamesProxy = await webR.evalR(`colnames(${dataframe})`);
    const colnamesJs = await colnamesProxy.toJs();

    //@ts-ignore
    setColnames(colnamesJs.values);

    const rownamesProxy = await webR.evalR(`rownames(${dataframe})`);
    const rownamesJs = await rownamesProxy.toJs();

    //@ts-ignore
    setRownames(rownamesJs.values);

    const dataProxy = await webR.evalR(dataframe);
    const dataJs = await dataProxy.toJs();

    //@ts-ignore
    setData(dataJs.values.map((v) => v.values));
  };

  useEffect(() => {
    fetchData();
  }, [dataframe, updates]);

  if (!data.length) {
    return <Loading>Generating table...</Loading>;
  }

  return (
    <div>
      <div className="dataframe shadow">
        <div className="dataframe-header">
          <table>
            <thead>
              <tr>
                <th></th>
                {colnames.map((name) => (
                  <th key={name}>{name}</th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="dataframe-body">
          <table>
            <tbody>
              {rownames.map((name, i) => {
                return (
                  <tr key={name + i}>
                    <th>{name}</th>

                    {colnames.map((_, j) => (
                      <td key={name + i + j}>{data[j][i]} </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataFrame;
