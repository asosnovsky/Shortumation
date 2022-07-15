import InputNumber from "components/Inputs/InputNumber";
import { RepeatAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";
import { InputAutoComplete } from "components/Inputs/InputAutoComplete";

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
  Component: ({ state, setState }) => {
    const repeatType = determineType(state.repeat);
    return (
      <>
        <InputAutoComplete
          label="Type"
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
            label="How many times?"
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
