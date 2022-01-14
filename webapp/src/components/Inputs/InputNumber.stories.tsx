import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

import InputNumber from "./InputNumber";

export default {
  title: 'Inputs/InputNumber',
  component: InputNumber,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  argTypes: {
    label: {
      defaultValue: 'Sample Title'
    }
  }
} as ComponentMeta<typeof InputNumber>;


export const NullStart: ComponentStory<typeof InputNumber> = args => {

  const [value, setValue] = useState<number | undefined>(undefined)
  return <div className="page">
    <InputNumber {...args} value={value} onChange={setValue} />
  </div>
}
export const SomeStuffAtStart: ComponentStory<typeof InputNumber> = args => {

  const [value, setValue] = useState<number | undefined>(10)
  return <div className="page">
    <InputNumber {...args} value={value} onChange={setValue} />
  </div>
}
