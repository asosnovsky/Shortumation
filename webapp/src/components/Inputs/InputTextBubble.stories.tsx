import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import InputTextBubble from "./InputTextBubble";

export default {
  title: 'Inputs/InputTextBubble',
  component: InputTextBubble,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  argTypes: {
    label: {
      defaultValue: 'Sample Title'
    }
  }
} as ComponentMeta<typeof InputTextBubble>;


export const ArrayText: ComponentStory<typeof InputTextBubble> = args => {

  const [value, setValue] = useState<string | string[]>(['wow', 'lots of bubbles', 'itchen', 'bathroom'])
  return <Page>
    <div style={{ maxWidth: '200px', overflow: 'hidden' }}>
      <InputTextBubble {...args} value={value} onChange={setValue} />
    </div>
  </Page>
}

export const JustText: ComponentStory<typeof InputTextBubble> = args => {

  const [value, setValue] = useState<string | string[]>('hello')
  return <Page>
    <InputTextBubble {...args} value={value} onChange={setValue} />
  </Page>
}

export const ManyOptions: ComponentStory<typeof InputTextBubble> = args => {

  const [value, setValue] = useState<string | string[]>('hello')
  return <Page>
    <InputTextBubble {...args} value={value} onChange={setValue} />
  </Page>
}

ManyOptions.args = {
  ...ManyOptions.args,
  options: [
    'sensor.humidity_bathroom',
    'sensor.humidity_bedroom',
    'sensor.humidity_laundry',
    'sensor.temp_bathroom',
    'sensor.temp_bedroom',
    'switch.living_room',
    'switch.bathroom',
    'light.bedroom_main',
    'light.bedroom_second',
  ]
}