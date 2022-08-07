import InputText from "components/Inputs/Base/InputText";
import { SceneAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";

export const ActionSceneState: OptionManager<SceneAction> = {
  defaultState: () => ({
    scene: "",
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    return (
      <>
        <InputText
          label="Scene"
          value={state.scene ?? ""}
          onChange={(d) => setState({ ...state, scene: d })}
        />
      </>
    );
  },
};
