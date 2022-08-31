import { useState } from "react";
import { AutomationTime } from "types/automations/common";

import { InputTime } from "./InputTime";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputTime,
  BaseTemplate: (args) => {
    const [value, setValue] = useState<AutomationTime | undefined>(undefined);
    return (
      <div
        style={{
          padding: "1em",
        }}
      >
        <InputTime
          {...args}
          value={args.restrictEmpty ? "00:00:00" : value}
          onChange={(t) => {
            setValue(t);
            args.onChange(t);
          }}
        />
      </div>
    );
  },
  meta: {
    title: "Inputs/InputTime",
  },
});

export default componentMeta;
export const Example = make({});

export const SimpleText = make({
  label: "Time Stamp",
  value: "10",
});
