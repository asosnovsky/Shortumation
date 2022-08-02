import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import { InputService } from "./InputService";

export default {
  title: 'Inputs/InputService',
  component: InputService,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  argTypes: {}
} as ComponentMeta<typeof InputService>;



const Template: ComponentStory<typeof InputService> = args => {
  const [value, setValue] = useState(args.value)
  return <Page>
    <div style={{
      maxWidth: 200
    }}>
      <InputService {...args} value={value as any} onChange={(v: any) => {
        setValue(v)
        args.onChange(v as any)
      }} />
    </div>
  </Page>

}

export const Single = Template.bind({})
Single.args = {
  ...Single.args,
  multiple: false,
  value: ''
} as any
