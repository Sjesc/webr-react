import React, { FC, HTMLProps, PropsWithChildren } from "react";

type HeadingProps = HTMLProps<HTMLDivElement>;

const Heading: FC<HeadingProps> = ({ children, style, ...props }) => {
  return (
    <div
      className="contrast shadow"
      style={{ padding: "1em 2em", display: "inline-block", ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Heading;
