import { useState } from "react";

import InputNumber from "./InputNumber";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputNumber,
  meta: {
    title: "Inputs/InputNumber",
    argTypes: {
      label: {
        defaultValue: "Sample Title",
      },
    },
  },
  BaseTemplate: (args) => {
    const [value, setValue] = useState<number | undefined>(args.value);
    return <InputNumber {...args} value={value} onChange={setValue} />;
  },
});

export default componentMeta;

export const NullStart = make({
  value: undefined,
});

export const SomeStuffAtStart = make({
  value: 10,
});
