import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutomationListBox } from "./AutomationListBox";
import { NODE_HEIGHT, NODE_WIDTH, ADD_HEIGHT, ADD_WIDTH, CIRCLE_SIZE, DISTANCE_FACTOR } from 'components/DAGSvgs/constants';
import { createMockAuto } from "utils/mocks";

export default {
  title: 'App/AutomationListBox',
  component: AutomationListBox,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
  }
} as ComponentMeta<typeof AutomationListBox>;


const Template: ComponentStory<typeof AutomationListBox> = args => {
  const [autos, setAutos] = useState(args.automations)
  console.log({ args })
  return <div className="page">
    <AutomationListBox {...args} automations={autos} />
  </div>
}

export const EmptyStart = Template.bind({})
EmptyStart.args = {
  ...EmptyStart.args,
  automations: [],
}

export const FewAutos = Template.bind({})
FewAutos.args = {
  ...FewAutos.args,
  automations: [
    createMockAuto({ "Room": "Bathroom", "Type": "Lights" }),
    createMockAuto({ "Room": "Bathroom", "Type": "Climate" }),
    createMockAuto({ "Room": "Living Room", "Type": "Climate" }),
    createMockAuto({ "Type": "Climate" }),
    createMockAuto({ "Type": "Lights", "Routine": "Myself" }),
    createMockAuto({ "Routine": "DNS", "Type": "SSL" }),
    createMockAuto({ "Room": "Bedroom", "Type": "Lights", "Routine": "Baby" }),
    createMockAuto({ "Room": "Office", "Type": "Lights" }),
    createMockAuto({ "Room": "Office" }),
    createMockAuto(),
  ],
}
