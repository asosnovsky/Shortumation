import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import InputTextBubble, { InputEntity } from "./InputTextBubble";

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


export const EntityId: ComponentStory<typeof InputTextBubble> = args => {

  const [value, setValue] = useState<string | string[]>(['sensor.bathroom'])
  return <Page>
    <InputEntity value={value} onChange={setValue} />
  </Page>
}
