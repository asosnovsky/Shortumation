import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { usePageTheme } from "styles/page";
import InputText from "./InputText";

export default {
  title: 'Inputs/InputText',
  component: InputText,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputText>;


const Template: ComponentStory<typeof InputText> = args => {
  const { classes } = usePageTheme({});
  const [value, setValue] = useState('')
  return <div className={classes.page}>
    <InputText {...args} value={value} onChange={setValue} />
  </div>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Entity ID",
}
