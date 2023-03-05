export const cleanScript = (script: string) => {
  return script.replace(/(\r\n|\n|\r)/gm, "");
};
