import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { SequenceNode } from "./SequenceNode";
import { DAGGraphBoard } from "components/DAGGraph/board";
import { SequenceNodeMaker } from "./index";
import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";

export default {
  title: "DAGGraph/Nodes/Sequence",
  component: SequenceNode,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    ...DEFAULT_DIMS.node,
    color: "lblue",
    label: "test",
    hasInput: true,
    enabled: true,
  },
} as ComponentMeta<typeof SequenceNode>;

const Template: ComponentStory<typeof SequenceNode> = (args) => {
  return (
    <Page>
      <DAGGraphBoard
        closeModal={() => {}}
        state={{
          ready: true,
          data: {
            elements: {
              edges: [],
              nodes: [
                SequenceNodeMaker.makeElement(
                  {
                    id: "test",
                    position: {
                      x: 50,
                      y: 50,
                    },
                  },
                  DEFAULT_DIMS,
                  args
                ),
              ],
            },
          },
        }}
      />
    </Page>
  );
};

export const Colors: ComponentStory<typeof SequenceNode> = (args) => {
  return (
    <Page>
      <DAGGraphBoard
        closeModal={() => {}}
        state={{
          ready: true,
          data: {
            elements: {
              edges: [],
              nodes: ["blue", "red", "green", "lblue"].map((color: any, i) =>
                SequenceNodeMaker.makeElement(
                  {
                    id: color,
                    position: {
                      x:
                        50 +
                        DEFAULT_DIMS.node.height *
                          DEFAULT_DIMS.distanceFactor.node *
                          i,
                      y:
                        50 +
                        DEFAULT_DIMS.node.height *
                          DEFAULT_DIMS.distanceFactor.node *
                          i,
                    },
                  },
                  DEFAULT_DIMS,
                  { ...args, color }
                )
              ),
            },
          },
        }}
      />
    </Page>
  );
};

export const OnMoveAllDirections = Template.bind({});
OnMoveAllDirections.args = {
  ...OnMoveAllDirections.args,
  onMove: {
    up: console.info,
    down: console.info,
    left: console.info,
    right: console.info,
  },
  onAdd: {
    up: console.info,
    down: console.info,
    left: console.info,
    right: console.info,
  },
};
