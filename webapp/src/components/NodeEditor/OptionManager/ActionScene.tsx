import { InputEntity } from "components/Inputs/AutoComplete/InputEntities";
import { SceneAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";

export const ActionSceneState: OptionManager<SceneAction> = {
  defaultState: () => ({
    scene: "",
  }),
  isReady: () => true,
  Component: ({ state, setState, langStore }) => {
    return (
      <>
        <InputEntity
          label={langStore.get("SCENE")}
          restrictToDomain={["scene"]}
          value={state.scene ?? ""}
          onChange={(d) => setState({ ...state, scene: d ?? "" })}
        />
      </>
    );
  },
};
