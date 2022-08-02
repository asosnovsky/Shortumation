import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import { InputEntity } from "./InputEntities";

export default {
  title: 'Inputs/InputEntity',
  component: InputEntity,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  argTypes: {}
} as ComponentMeta<typeof InputEntity>;



const Template: ComponentStory<typeof InputEntity> = args => {
  const [value, setValue] = useState(args.value)
  return <Page>
    <div style={{
      maxWidth: 200
    }}>
      <InputEntity {...args} value={value as any} onChange={(v: any) => {
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
  value: 'sensor.bathroom'
} as any

export const Many = Template.bind({})
Many.args = {
  ...Many.args,
  multiple: true,
  value: ['sensor.bathroom', 'person.ari']
} as any

export const ManyEmpty = Template.bind({})
ManyEmpty.args = {
  ...ManyEmpty.args,
  multiple: true,
  value: []
} as any


export const ManyButGotSingle = Template.bind({})
ManyButGotSingle.args = {
  ...ManyButGotSingle.args,
  multiple: true,
  value: 'sensor.bathroom'
} as any


export const InvalidDomain = Template.bind({})
InvalidDomain.args = {
  ...InvalidDomain.args,
  multiple: true,
  value: 'sensor.bathroom',
  restrictToDomain: ['zone'],
} as any


export const InvalidManyDomain = Template.bind({})
InvalidManyDomain.args = {
  ...InvalidManyDomain.args,
  multiple: true,
  value: 'sensor.bathroom',
  restrictToDomain: ['zone', 'switch'],
} as any

export const InvalidLots = Template.bind({})
InvalidLots.args = {
  ...InvalidLots.args,
  multiple: true,
  value: ['person.ari', 'sensor.bathroom', 'binary_sensor.ping_tv', 'device_tracker.phone'],
  restrictToDomain: ['zone', 'switch'],
} as any
