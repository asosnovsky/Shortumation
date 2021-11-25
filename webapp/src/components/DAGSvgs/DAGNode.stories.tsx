import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DAGNode } from "./DAGNode";
import { SVGBoard } from './Board';
import { NODE_HEIGHT, NODE_WIDTH } from './constants';
import { DAGEdge } from "./DAGEdge";

const GRAPH_HEIGHT = 300;

export default {
  title: 'DAGSvgs/DAGNode',
  component: DAGNode,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    height: NODE_HEIGHT,
    width: NODE_WIDTH,
    text: "Test",
    loc: [NODE_WIDTH * 2,GRAPH_HEIGHT / 2]
  }
} as ComponentMeta<typeof DAGNode>;

export const Basic: ComponentStory<typeof DAGNode> = args => <SVGBoard 
  graphHeight={GRAPH_HEIGHT}
>
    <DAGNode {...args}/>
</SVGBoard>

export const WithEdge: ComponentStory<typeof DAGNode> = args => <SVGBoard 
  graphHeight={GRAPH_HEIGHT}
>
    <DAGNode {...args} />
</SVGBoard>
WithEdge.args = {
  ...(WithEdge.args ?? {}),
  edge: {
    color: 'white',
    loc: [ NODE_WIDTH * 4, NODE_HEIGHT * 2 ]
  }
}

export const WithManyEdges: ComponentStory<typeof DAGNode> = args => <SVGBoard 
  graphHeight={GRAPH_HEIGHT}
>
  <DAGNode {...args} />
  {[
    // TODO: make it nicer to view when from behind
    // [0, 0],
    // [args.loc[0] - args.width, args.loc[1] + args.height / 2], // behind
    // [args.loc[0] - 0.5*args.width, args.loc[1] + args.height ], // behind
    // [args.loc[0], args.loc[1] + args.height ], // behind
    // [args.loc[0], args.loc[1] + 2 * args.height ], // behind
    [args.loc[0] + args.width / 2, args.loc[1] + 2 * args.height ], // below
    [args.loc[0] + args.width, args.loc[1] + args.height * 2], // down
    [args.loc[0] + args.width, args.loc[1] - args.height * 2], // up
    [args.loc[0] + 2*args.width, args.loc[1] + args.height * 2], // down right
    [args.loc[0] + 2*args.width, args.loc[1] + args.height / 2], // forward
    [args.loc[0] + 2*args.width, args.loc[1] - args.height * 2], // up right
  ].map((p: any) => <DAGEdge
    p1={[args.loc[0] + args.width, args.loc[1] + args.height / 2]}
    p2={p}
    direction="1->2"
    color="white"
    // debug
  />)}
</SVGBoard>
