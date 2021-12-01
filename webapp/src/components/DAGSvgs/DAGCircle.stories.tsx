import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SVGBoard } from './Board';
import { DAGCircle } from "./DAGCircle";


export default {
  title: 'DAGSvgs/DAGCircle',
  component: DAGCircle,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    size: 20,
    loc: [50, 50]
  }
} as ComponentMeta<typeof DAGCircle>

export const Basic: ComponentStory<typeof DAGCircle> = args => {
  return <SVGBoard>
    <DAGCircle
      {...args}
    />
    <DAGCircle
      size={args.size}
      loc={[args.loc[0] + args.size, args.loc[1]]}
    />
  </SVGBoard>
}

