import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState, useEffect } from 'react';

import { InputList } from "./InputList";

export default {
  title: 'Inputs/InputList',
  component: InputList,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputList>;


const Template: ComponentStory<typeof InputList> = args => {

  const [value, setValue] = useState(args.current);
  useEffect(() => {
    if (value !== args.current) {
      setValue(args.current)
    }
  }, [args.current])
  return <div className="page">
    <InputList {...args} current={value} onChange={setValue} />
  </div>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Entity ID",
  options: [
    'Bob',
    'Martin',
    "Toots"
  ]
}


export const InvalidSelection = Template.bind({})
InvalidSelection.args = {
  current: "Derek",
  label: "Entity ID",
  options: [
    'Bob',
    'Martin',
    "Toots"
  ]
}
