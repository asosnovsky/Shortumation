import { useState } from "react";
import { useCookies } from "react-cookie";

export const useAutomationManagerState = () => {
  const [
    cookies,
    setCookies,
    // eslint-disable-next-line
    _,
  ] = useCookies(["selectedAutomation"]);
  let initialCurrent = null;
  try {
    initialCurrent = cookies.selectedAutomation ?? null;
  } catch (_) {}

  const [current, setCurrent] = useState<string | null>(initialCurrent);

  return {
    current,
    setCurrent(i: string | null) {
      setCurrent(i);
      setCookies("selectedAutomation", i === null ? undefined : i);
    },
  };
};
