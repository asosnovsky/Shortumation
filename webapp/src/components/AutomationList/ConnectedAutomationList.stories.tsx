import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConnectedAutomationList } from ".";
import { createMockAuto } from "utils/mocks";
import { useMockApiService } from "apiService";
import * as dgconst from 'components/DAGSvgs/constants';

export default {
  title: 'App/AutomationList/Connected',
  component: ConnectedAutomationList,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    dims: {
      nodeHeight: dgconst.NODE_HEIGHT,
      nodeWidth: dgconst.NODE_WIDTH,
      distanceFactor: dgconst.DISTANCE_FACTOR,
      circleSize: dgconst.CIRCLE_SIZE,
      padding: {
        x: dgconst.PADDING,
        y: dgconst.PADDING,
      },
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
