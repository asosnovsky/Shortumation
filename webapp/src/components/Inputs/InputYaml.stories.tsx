import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

import InputYaml from "./InputYaml";

export default {
  title: 'Inputs/InputYaml',
  component: InputYaml,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputYaml>;


const Template: ComponentStory<typeof InputYaml> = args => {

  const [value, setValue] = useState({
    "test": "data"
  })
  return <div className="page">
    <InputYaml {...args} value={value} onChange={setValue} />
  </div>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Template",
}
