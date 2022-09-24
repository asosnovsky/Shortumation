import { useState } from "react";

import { InputEntity } from "./InputEntities";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputEntity,
  meta: {
    title: "Inputs/InputEntity",
  },
  BaseTemplate: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div
        style={{
          maxWidth: 200,
          margin: "5em",
        }}
      >
        <InputEntity
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
  value: "sensor.bathroom",
});

export const Many = make({
  multiple: true,
  value: ["sensor.bathroom", "person.ari"],
});

export const ManyEmpty = make({
  multiple: true,
  value: [],
});

export const ManyButGotSingle = make({
  multiple: true,
  value: "sensor.bathroom",
});

export const InvalidDomain = make({
  multiple: true,
  value: "sensor.bathroom",
  restrictToDomain: ["zone"],
});

export const InvalidManyDomain = make({
  multiple: true,
  value: "sensor.bathroom",
  restrictToDomain: ["zone", "switch"],
});

export const InvalidLots = make({
  multiple: true,
  value: [
    "person.ari",
    "sensor.bathroom",
    "binary_sensor.ping_tv",
    "device_tracker.phone",
  ],
  restrictToDomain: ["zone", "switch"],
});
