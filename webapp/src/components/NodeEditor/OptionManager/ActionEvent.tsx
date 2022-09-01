import InputYaml from "components/Inputs/Base/InputYaml";
import InputText from "components/Inputs/Base/InputText";
import { FireEventAction } from "types/automations/actions";
import { OptionManager, updateActionData } from "./OptionManager";

export const ActionEventState: OptionManager<FireEventAction> = {
  defaultState: () => ({
    alias: "Fire Event",
    event: "",
    event_data: {},
  }),
  isReady: ({ alias, event }) => alias !== "" && event !== "",
  Component: ({ state, setState, langStore }) => {
    const update = updateActionData(state, setState);
    return (
      <>
        <InputText
          textBoxFor="event"
          label={langStore.get("EVENT")}
          value={state.event}
          onChange={(event) => update({ event })}
        />
        <InputYaml
          label={langStore.get("EVENT_DATA")}
          value={state.event_data}
          onChange={(event_data) => update({ event_data })}
        />
      </>
    );
  },
};
