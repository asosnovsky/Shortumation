import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConnectedAutomationList } from ".";
import { NODE_HEIGHT, NODE_WIDTH, ADD_HEIGHT, ADD_WIDTH, CIRCLE_SIZE, DISTANCE_FACTOR } from 'components/DAGSvgs/constants';
import { createMockAuto } from "utils/mocks";
import { useMockApiService } from "apiService";

export default {
  title: 'App/AutomationList/Connected',
  component: ConnectedAutomationList,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    dims: {
      nodeHeight: NODE_HEIGHT,
      nodeWidth: NODE_WIDTH,
      addHeight: ADD_HEIGHT,
      addWidth: ADD_WIDTH,
      circleSize: CIRCLE_SIZE,
      distanceFactor: DISTANCE_FACTOR,
    },
    initialAutomations: [],
  }
} as ComponentMeta<typeof ConnectedAutomationList>;


const Template: ComponentStory<any> = args => {
  const api = useMockApiService(args.initialAutomations);
  return <div className="page">
    <ConnectedAutomationList
      {...args}
      api={api}
    />
  </div>
}

export const EmptyStart = Template.bind({})


export const FewAutos = Template.bind({})
FewAutos.args = {
  ...FewAutos.args,
  initialAutomations: [
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
