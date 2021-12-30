import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { usePageTheme } from "styles/page";
import { AutomationList } from ".";
import { NODE_HEIGHT, NODE_WIDTH, ADD_HEIGHT, ADD_WIDTH, CIRCLE_SIZE, DISTANCE_FACTOR } from 'components/DAGSvgs/constants';
import { createMockAuto } from "utils/mocks";

export default {
  title: 'App/AutomationList',
  component: AutomationList,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    dims: {
      nodeHeight: NODE_HEIGHT,
      nodeWidth: NODE_WIDTH,
      addHeight: ADD_HEIGHT,
      addWidth: ADD_WIDTH,
      circleSize: CIRCLE_SIZE,
      distanceFactor: DISTANCE_FACTOR,
    }
  }
} as ComponentMeta<typeof AutomationList>;


const Template: ComponentStory<typeof AutomationList> = args => {
  const { classes } = usePageTheme({});
  const [autos, setAutos] = useState(args.automations)
  return <div className={classes.page}>
    <AutomationList {...args} automations={autos}
      onAdd={a => {
        args.onAdd(a);
        setAutos([...autos, a]);
      }}
      onRemove={i => {
        args.onRemove(i);
        setAutos([
          ...autos.slice(0, i),
          ...autos.slice(i + 1),
        ]);
      }}
      onUpdate={(i, a) => {
        args.onUpdate(i, a);
        setAutos([
          ...autos.slice(0, i),
          a,
          ...autos.slice(i + 1),
        ]);
      }}
    />
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
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
  ],
}
