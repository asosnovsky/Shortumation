import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import InputTextArea from "./InputTextArea";

export default {
  title: 'Inputs/InputTextArea',
  component: InputTextArea,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputTextArea>;


const Template: ComponentStory<typeof InputTextArea> = args => {

  const [value, setValue] = useState('')
  return <Page>
    <InputTextArea {...args} value={value} onChange={setValue} />
  </Page>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Entity ID",
}
