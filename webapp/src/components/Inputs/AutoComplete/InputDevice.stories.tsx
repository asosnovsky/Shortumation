import { useState } from "react";

import { InputDevice } from "./InputDevice";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputDevice,
  meta: {
    title: "Inputs/InputDevice",
  },
  BaseTemplate: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div
        style={{
          maxWidth: 200,
        }}
      >
        <InputDevice
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
  value: "sensor.humidity_bathroom",
});
