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
      size={args.size}
      loc={args.loc}
    />
    <DAGCircle
      size={args.size}
      loc={[args.loc[0] + args.size, args.loc[1]]}
      onAdd={args.onAdd}
    />
    <DAGCircle
      size={args.size}
      loc={[args.loc[0] + 2 * args.size, args.loc[1]]}
      onEdit={args.onEdit}
    />
    <DAGCircle
      size={args.size}
      loc={[args.loc[0] + 3 * args.size, args.loc[1]]}
      onEdit={args.onEdit}
      onRemove={args.onRemove}
    />
    <DAGCircle
      size={args.size}
      loc={[args.loc[0] + 4 * args.size, args.loc[1]]}
      onRemove={args.onRemove}
    />
  </SVGBoard>
}

