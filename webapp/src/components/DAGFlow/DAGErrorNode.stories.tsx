

import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DAGAutomationFlow } from '.';
import * as dgconst from "components/DAGFlow/constants";
import ReactFlow, { Controls } from 'react-flow-renderer';
import { DAGErrorNode } from "./DAGErrorNode";
import { convertToFlowNode } from "./helpers";


export default {
  title: 'DAGAutomationFlow/Viewer/DAGErrorNode',
  component: DAGAutomationFlow,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    "height": dgconst.NODE_HEIGHT,
    "width": dgconst.NODE_WIDTH,
  }
} as ComponentMeta<typeof DAGErrorNode>

export const Examples: ComponentStory<typeof DAGErrorNode> = args => {
  const nodes = ["1", "2", "3", "4"].map((id, i) => ({
    "data": args,
    "id": id,
    "type": "mynode",
    "position": {
      "x": 50 + dgconst.NODE_HEIGHT * dgconst.DISTANCE_FACTOR * i,
      "y": 50 + dgconst.NODE_HEIGHT * dgconst.DISTANCE_FACTOR * i
    }
  }));
  return <div className="page">
    <ReactFlow
      defaultNodes={nodes}
      nodeTypes={{
        "mynode": convertToFlowNode(DAGErrorNode)
      }}
      snapToGrid
      onlyRenderVisibleElements
      nodesConnectable={false}
      nodesDraggable={false}
    >
      <Controls />
    </ReactFlow>
  </div>
}
