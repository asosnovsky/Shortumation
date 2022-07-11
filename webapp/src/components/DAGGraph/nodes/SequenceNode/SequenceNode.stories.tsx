import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import * as dgconst from "components/DAGFlow/constants";
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
    color: "lblue",
    height: dgconst.NODE_HEIGHT,
    width: dgconst.NODE_WIDTH,
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
                      x: 50 + dgconst.NODE_HEIGHT * dgconst.DISTANCE_FACTOR * i,
                      y: 50 + dgconst.NODE_HEIGHT * dgconst.DISTANCE_FACTOR * i,
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
    up: console.log,
    down: console.log,
    left: console.log,
    right: console.log,
  },
  onAdd: {
    up: console.log,
    down: console.log,
    left: console.log,
    right: console.log,
  },
};
