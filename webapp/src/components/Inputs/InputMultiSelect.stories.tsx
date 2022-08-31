import { useEffect, useState } from "react";

import InputMultiSelect from "./InputMultiSelect";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputMultiSelect,
  BaseTemplate: (args) => {
    const [value, setValue] = useState<number[]>(args.selected);

    useEffect(() => {
      setValue(args.selected);
    }, [args.selected]);

    return (
      <InputMultiSelect
        {...args}
        onChange={(a) => {
          setValue(a);
          args.onChange(a);
        }}
        options={args.options}
        selected={value}
      />
    );
  },
  meta: {
    title: "Inputs/InputMultiSelect",
  },
});

export default componentMeta;

export const Simple = make({
  label: "Room Tags",
  options: ["Bears", "Cats", "Kitchen", "Bathroom"],
  selected: [1],
  max: 2,
});
