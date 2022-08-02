import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import { InputDevice } from "./InputDevice";

export default {
  title: 'Inputs/InputDevice',
  component: InputDevice,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  argTypes: {}
} as ComponentMeta<typeof InputDevice>;



const Template: ComponentStory<typeof InputDevice> = args => {
  const [value, setValue] = useState(args.value)
  return <Page>
    <div style={{
      maxWidth: 200
    }}>
      <InputDevice {...args} value={value as any} onChange={(v: any) => {
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
  value: 'sensor.humidity_bathroom'
} as any
