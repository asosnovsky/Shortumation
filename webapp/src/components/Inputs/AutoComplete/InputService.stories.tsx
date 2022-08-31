import { useState } from "react";

import { InputService } from "./InputService";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputService,
  meta: {
    title: "Inputs/InputService",
  },
  BaseTemplate: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div
        style={{
          maxWidth: 200,
        }}
      >
        <InputService
          {...args}
          value={value as any}
          onChange={(v: any) => {
            setValue(v);
            args.onChange(v as any);
          }}
        />
      </div>
    );
  },
});

export default componentMeta;
export const Example = make({});

export const Single = make({
  multiple: false,
  value: "",
});
