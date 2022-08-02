import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import InputText from "./InputText";

export default {
  title: 'Inputs/InputText',
  component: InputText,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputText>;


const Template: ComponentStory<typeof InputText> = args => {

  const [value, setValue] = useState('')
  return <Page>
    <InputText {...args} value={value} onChange={setValue} />
  </Page>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Entity ID",
}
