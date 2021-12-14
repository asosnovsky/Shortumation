import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NodeEditor } from ".";
import { usePageTheme } from "styles/page";


export default {
  title: 'NodeEditor',
  component: NodeEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {}
} as ComponentMeta<typeof NodeEditor>

const Base: ComponentStory<typeof NodeEditor> = props => {
  const { classes } = usePageTheme({});
  return <div className={classes.page}>
    <NodeEditor {...props} />
  </div>
};
export const Action = Base.bind({})
Action.args = {
  ...Action.args,
  node: {
    $smType: 'action',
    action: 'service',
    action_data: {
      'data': {},
      'service': '',
      'target': '',
    }
  }
}
export const SingleOption = Action.bind({})
SingleOption.args = {
  ...Action.args,
  allowedTypes: ['action'],
}
