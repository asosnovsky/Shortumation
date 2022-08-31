import { useState } from "react";

import InputTextBubble from "./InputTextBubble";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputTextBubble,
  BaseTemplate: (args) => {
    const [value, setValue] = useState<string | string[]>(args.value ?? "");
    return (
      <div style={{ maxWidth: "200px", overflow: "hidden" }}>
        <InputTextBubble {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  meta: {
    title: "Inputs/InputTextBubble",
    argTypes: {
      label: {
        defaultValue: "Sample Title",
      },
    },
  },
});

export default componentMeta;

export const ArrayText = make({
  value: ["wow", "lots of bubbles", "itchen", "bathroom"],
});
export const JustText = make({
  value: "hello",
});

export const ManyOptions = make({
  value: "hello",
  options: [
    "sensor.humidity_bathroom",
    "sensor.humidity_bedroom",
    "sensor.humidity_laundry",
    "sensor.temp_bathroom",
    "sensor.temp_bedroom",
    "switch.living_room",
    "switch.bathroom",
    "light.bedroom_main",
    "light.bedroom_second",
  ],
});
