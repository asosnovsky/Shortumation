

import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DAGAutomationFlow } from '.';
import { useState } from 'react';
import * as dgconst from "components/DAGFlow/constants";
import ReactFlow, { Controls } from 'react-flow-renderer';
import { DAGNode } from "./DAGNode";
import { convertToFlowNode } from "./helpers";
import { Page } from "components/Page";


export default {
  title: 'DAGAutomationFlow/Viewer/DAGNode',
  component: DAGAutomationFlow,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    "color": "lblue",
    "height": dgconst.NODE_HEIGHT,
    "width": dgconst.NODE_WIDTH,
    "label": "test",
    "hasInput": true,
  }
} as ComponentMeta<typeof DAGNode>

export const Colors: ComponentStory<typeof DAGNode> = args => {
  const nodes = ["blue", "red", "green", "lblue"].map((color, i) => ({
    "data": { ...args, color },
    "id": color,
    "type": "mynode",
    "position": { "x": 50 + dgconst.NODE_HEIGHT * dgconst.DISTANCE_FACTOR * i, "y": 50 + dgconst.NODE_HEIGHT * dgconst.DISTANCE_FACTOR * i }
  }));
  return <Page>
    <ReactFlow
      defaultNodes={nodes}
      nodeTypes={{
        "mynode": convertToFlowNode(DAGNode)
      }}
      snapToGrid
      onlyRenderVisibleElements
      nodesConnectable={false}
      nodesDraggable={false}
    >
      <Controls />
    </ReactFlow>
  </Page>
}
