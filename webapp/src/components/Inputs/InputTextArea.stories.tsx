import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { usePageTheme } from "styles/page";
import InputTextArea from "./InputTextArea";

export default {
  title: 'Inputs/InputTextArea',
  component: InputTextArea,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputTextArea>;


const Template: ComponentStory<typeof InputTextArea> = args => {
  const { classes } = usePageTheme({});
  const [value, setValue] = useState('')
  return <div className={classes.page}>
    <InputTextArea {...args} value={value} onChange={setValue} />
  </div>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Entity ID",
}
