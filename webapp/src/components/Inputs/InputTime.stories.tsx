import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutomationTime } from "types/automations/common";

import InputTime from "./InputTime";

export default {
  title: 'Inputs/InputTime',
  component: InputTime,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputTime>;


const Template: ComponentStory<typeof InputTime> = args => {

  const [value, setValue] = useState<AutomationTime>({

  })
  return <div className="page">
    <InputTime {...args} value={value} onChange={setValue} />
  </div>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Time Stamp",
}
