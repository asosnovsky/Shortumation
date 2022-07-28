import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useEffect, useState } from "react";

import InputMultiSelect from "./InputMultiSelect";

export default {
  title: "Inputs/InputMultiSelect",
  component: InputMultiSelect,
  parameters: { actions: { argTypesRegex: "^on.*" } },
} as ComponentMeta<typeof InputMultiSelect>;

const Template: ComponentStory<typeof InputMultiSelect> = (args) => {
  const [value, setValue] = useState<number[]>(args.selected);

  useEffect(() => {
    setValue(args.selected);
  }, [args.selected]);

  return (
    <Page>
      <InputMultiSelect
        {...args}
        onChange={(a) => {
          setValue(a);
          args.onChange(a);
        }}
        options={args.options}
        selected={value}
      />
    </Page>
  );
};

export const Simple = Template.bind({});
Simple.args = {
  label: "Room Tags",
  options: ["Bears", "Cats", "Kitchen", "Bathroom"],
  selected: [1],
  max: 2,
};
