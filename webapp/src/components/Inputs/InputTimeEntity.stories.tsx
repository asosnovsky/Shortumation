import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import { InputTimeEntity } from "./InputTimeEntity";

export default {
  title: "Inputs/InputTimeEntity",
  component: InputTimeEntity,
  parameters: { actions: { argTypesRegex: "^on.*" } },
} as ComponentMeta<typeof InputTimeEntity>;

const Template: ComponentStory<typeof InputTimeEntity> = (args) => {
  const [value, setValue] = useState("");
  return (
    <Page>
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
    </Page>
  );
};

export const SimpleText = Template.bind({});
