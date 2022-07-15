import { FC } from "react";

export const SimpleErrorElement: FC<{ error: Error }> = ({ error }) => {
  return (
    <div
      style={{
        padding: "1em",
      }}
    >
      <b>Error Name</b>: {error?.name}
      <br />
      <b>Error Message</b>
      {error?.message}
      <br />
      <b>Error Stack</b>
      <code
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1em",
        }}
      >
        {error?.stack?.split("\n").map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </code>
      <br />
      <b>JSON:</b>
      <code>{JSON.stringify(error)}</code>
    </div>
  );
};
