import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import InputBoolean from "./InputBoolean";

export default {
  title: 'Inputs/InputBoolean',
  component: InputBoolean,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputBoolean>;


const Template: ComponentStory<typeof InputBoolean> = args => {
  const [state, onChange] = useState(args.value)
  return <Page>
    <InputBoolean {...args} value={state} onChange={v => {
      args.onChange(v)
      onChange(v)
    }} />
  </Page>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Template",
}
