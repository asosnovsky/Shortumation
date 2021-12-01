import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NodeEditor } from ".";
import { usePageTheme } from "styles/page";


export default {
  title: 'NodeEditor',
  component: NodeEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    nodeType: 'sequence',
    subType: 'and',
  }
} as ComponentMeta<typeof NodeEditor>

export const Basic: ComponentStory<typeof NodeEditor> = props => {
  const { classes } = usePageTheme({});
  return <div className={classes.page}>
    <NodeEditor {...props} />
  </div>
};
