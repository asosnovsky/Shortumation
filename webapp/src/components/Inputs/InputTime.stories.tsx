import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";
import { AutomationTime } from "types/automations/common";

import { InputTime } from "./InputTime";

export default {
  title: 'Inputs/InputTime',
  component: InputTime,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InputTime>;


const Template: ComponentStory<typeof InputTime> = args => {

  const [value, setValue] = useState<AutomationTime | undefined>(undefined);
  return <Page>
    <div style={{
      padding: '1em'
    }}>
      <InputTime {...args} value={value} onChange={t => {
        setValue(t)
        args.onChange(t)
      }} />
    </div>
  </Page>
}

export const SimpleText = Template.bind({})
SimpleText.args = {
  label: "Time Stamp",
  value: "10"
}
