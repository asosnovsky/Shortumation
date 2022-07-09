import { FC } from "react";

export const SimpleErrorElement: FC<{ error: Error }> = ({ error }) => {
  return (
    <>
      <b>{error?.name}</b>
      <br />
      <b>{error?.message}</b>
      <br />
      <span>{error?.stack}</span>
      <br />
      <span>{JSON.stringify(error)}</span>
    </>
  );
};
