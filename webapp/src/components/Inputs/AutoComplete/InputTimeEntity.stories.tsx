import { useState } from "react";

import { InputTimeEntity } from "./InputTimeEntity";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputTimeEntity,
  meta: {
    title: "Inputs/InputTimeEntity",
  },
  BaseTemplate: (args) => {
    const [value, setValue] = useState("");
    return (
      <div
        style={{
          padding: "1em",
        }}
      >
        <InputTimeEntity
          {...args}
          value={value}
          onChange={(t) => {
            setValue(t);
            args.onChange(t);
          }}
        />
      </div>
    );
  },
});

export const SimpleText = make({});
