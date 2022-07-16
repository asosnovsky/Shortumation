import { ParallelAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";

export const ActionParallelState: OptionManager<ParallelAction> = {
  defaultState: () => ({
    alias: "",
    parallel: [],
  }),
  isReady: () => true,
  Component: () => {
    return <></>;
  },
};
