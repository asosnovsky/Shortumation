import InputYaml from "components/Inputs/InputYaml";
import { ParallelAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";

export const ActionParallelState: OptionManager<ParallelAction> = {
  defaultState: () => ({
    alias: "",
    parallel: [],
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    return (
      <>
        <InputYaml
          label="Actions"
          value={state.parallel ?? []}
          onChange={(parallel) => setState({ ...state, parallel })}
        />
      </>
    );
  },
};
