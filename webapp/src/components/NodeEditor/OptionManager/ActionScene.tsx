import { InputEntity } from "components/Inputs/AutoComplete/InputEntities";
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
        <InputEntity
          label="Scene"
          restrictToDomain={["scene"]}
          value={state.scene ?? ""}
          onChange={(d) => setState({ ...state, scene: d ?? "" })}
        />
      </>
    );
  },
};
