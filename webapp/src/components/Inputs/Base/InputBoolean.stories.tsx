import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import InputBoolean from "./InputBoolean";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputBoolean,
  meta: {
    title: "Inputs/InputBoolean",
    args: {
      label: "Template",
    },
  },
  BaseTemplate: (args) => {
    const [state, onChange] = useState(args.value);
    return (
      <InputBoolean
        {...args}
        value={state}
        onChange={(v) => {
          args.onChange(v);
          onChange(v);
        }}
      />
    );
  },
});

export default componentMeta;
export const Example = make({});
