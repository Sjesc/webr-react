import React, { FC, HTMLProps, PropsWithChildren, useCallback } from "react";

interface Props {
  name?: string;
}

type CodeProps = HTMLProps<HTMLDivElement> & Props;

const Code: FC<CodeProps> = ({
  children,
  style,
  name,
  className,
  ...props
}) => {
  // Scroll to the bottom in the console
  const ref = useCallback((node: HTMLElement) => {
    if (node) {
      const resizeObserver = new ResizeObserver(() => {
        node.scrollTop = node.scrollHeight;
      });

      for (var i = 0; i < node.children.length; i++) {
        resizeObserver.observe(node.children[i]);
      }
    }
  }, []);

  return (
    <code
      className={`code shadow relative ${className}`}
      style={{
        maxHeight: "400px",
        overflowY: "auto",
        marginBottom: "1em",
        ...style,
      }}
      ref={ref}
      {...props}
    >
      {name && (
        <div
          className="absolute"
          style={{
            top: 0,
            right: 0,
            padding: "1em",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        >
          {name}
        </div>
      )}

      {children}
    </code>
  );
};

export default Code;
