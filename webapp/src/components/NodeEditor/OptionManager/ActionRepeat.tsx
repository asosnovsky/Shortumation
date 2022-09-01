import InputNumber from "components/Inputs/Base/InputNumber";
import { RepeatAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";
import { InputAutoComplete } from "components/Inputs/AutoComplete/InputAutoComplete";

const determineType = (repeatNode: RepeatAction["repeat"]) =>
  "count" in repeatNode ? "count" : "until" in repeatNode ? "until" : "while";

export const ActionRepeatState: OptionManager<RepeatAction> = {
  defaultState: () => ({
    alias: "Repeat",
    repeat: {
      while: [],
      sequence: [],
    },
  }),
  isReady: () => true,
  Component: ({ state, setState, langStore }) => {
    const repeatType = determineType(state.repeat);
    return (
      <>
        <InputAutoComplete
          label={langStore.get("TYPE")}
          value={repeatType}
          options={["while", "until", "count"]}
          onChange={(v) => {
            if (v === "while") {
              setState({
                ...state,
                repeat: {
                  sequence: state.repeat.sequence,
                  while: "until" in state.repeat ? state.repeat.until : [],
                },
              });
            } else if (v === "until") {
              setState({
                ...state,
                repeat: {
                  sequence: state.repeat.sequence,
                  until: "while" in state.repeat ? state.repeat.while : [],
                },
              });
            } else {
              setState({
                ...state,
                repeat: {
                  sequence: state.repeat.sequence,
                  count: 1,
                },
              });
            }
          }}
        />
        {"count" in state.repeat && (
          <InputNumber
            label={langStore.get("HOW_MANY_TIMES")}
            value={state.repeat.count}
            onChange={(count = 1) =>
              setState({
                ...state,
                repeat: {
                  sequence: state.repeat.sequence,
                  count,
                },
              })
            }
          />
        )}
      </>
    );
  },
};
