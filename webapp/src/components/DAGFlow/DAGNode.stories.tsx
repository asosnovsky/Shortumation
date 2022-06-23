import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DAGAutomationFlow } from ".";
import { useState } from "react";
import * as dgconst from "components/DAGFlow/constants";
import ReactFlow, { Controls } from "react-flow-renderer";
import { DAGNode } from "./DAGNode";
import { convertToFlowNode } from "./helpers";
import { Page } from "components/Page";

export default {
  title: "DAGAutomationFlow/Viewer/DAGNode",
  component: DAGAutomationFlow,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    color: "lblue",
    height: dgconst.NODE_HEIGHT,
    width: dgconst.NODE_WIDTH,
    label: "test",
    hasInput: true,
  },
} as ComponentMeta<typeof DAGNode>;

const Template: ComponentStory<typeof DAGNode> = (args) => {
  return (
    <Page>
      <ReactFlow
        defaultNodes={[
          {
            id: "one",
            position: { x: 0, y: 0 },
            type: "mynode",
            data: args,
          },
        ]}
        nodeTypes={{
          mynode: convertToFlowNode(DAGNode),
        }}
        snapToGrid
        onlyRenderVisibleElements
        nodesConnectable={false}
        nodesDraggable={false}
      >
        <Controls />
      </ReactFlow>
    </Page>
  );
};

export const Colors: ComponentStory<typeof DAGNode> = (args) => {
  const nodes = ["blue", "red", "green", "lblue"].map((color, i) => ({
    data: { ...args, color },
    id: color,
    type: "mynode",
    position: {
      x: 50 + dgconst.NODE_HEIGHT * dgconst.DISTANCE_FACTOR * i,
      y: 50 + dgconst.NODE_HEIGHT * dgconst.DISTANCE_FACTOR * i,
    },
  }));
  return (
    <Page>
      <ReactFlow
        defaultNodes={nodes}
        nodeTypes={{
          mynode: convertToFlowNode(DAGNode),
        }}
        snapToGrid
        onlyRenderVisibleElements
        nodesConnectable={false}
        nodesDraggable={false}
      >
        <Controls />
      </ReactFlow>
    </Page>
  );
};

export const OnMoveAllDirections = Template.bind({});
OnMoveAllDirections.args = {
  ...OnMoveAllDirections.args,
  onMove: {
    up: console.log,
    down: console.log,
    left: console.log,
    right: console.log,
  },
};
