import { ChooseAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";

export const ActionChooseState: OptionManager<ChooseAction> = {
  defaultState: () => ({
    alias: "",
    default: [],
    choose: [],
  }),
  isReady: () => true,
  Component: () => {
    return <></>;
  },
};
