import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ConnectedAutomationList } from ".";
import { createMockAuto } from "utils/mocks";
import { useMockApiService } from "apiService";
import { DEFAULT_DIMS } from 'components/DAGFlow/constants';
import { Page } from "components/Page";

export default {
  title: 'App/AutomationList/Connected',
  component: ConnectedAutomationList,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    dims: DEFAULT_DIMS,
    initialAutomations: [],
  }
} as ComponentMeta<typeof ConnectedAutomationList>;


const Template: ComponentStory<any> = args => {
  const api = useMockApiService(args.initialAutomations);
  return <Page>
    <ConnectedAutomationList
      {...args}
      api={api}
    />
  </Page>
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
