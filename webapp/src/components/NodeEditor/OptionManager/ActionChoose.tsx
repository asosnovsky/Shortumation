import InputYaml from "components/Inputs/InputYaml";
import { ChooseAction } from "types/automations/actions";
import { OptionManager, updateActionData } from "./OptionManager";

export const ActionChooseState: OptionManager<ChooseAction> = {
  defaultState: () => ({
    alias: "",
    default: [],
    choose: [],
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    return (
      <>
        <InputYaml
          label="Options"
          value={state.choose ?? []}
          onChange={(choose) => setState({ ...state, choose })}
        />
        <InputYaml
          label="Else"
          value={state.default ?? []}
          onChange={(d) => setState({ ...state, default: d })}
        />
      </>
    );
  },
};
