import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MockPage } from "components/Page";
import { ButtonNode } from "./ButtonNode";
import { DAGGraphBoard } from "components/DAGGraph/board";
import { ButtonNodeMaker } from ".";
import { DEFAULT_DIMS } from "../../elements/constants";
import { AddIcon } from "components/Icons";
import { SequenceNodeMaker } from "../SequenceNode";

export default {
  title: "DAGGraph/Nodes/Button",
  component: ButtonNode,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    icon: <AddIcon />,
    flipped: true,
    ...DEFAULT_DIMS.node,
  },
} as ComponentMeta<typeof ButtonNode>;

const Template: ComponentStory<typeof ButtonNode> = (args) => {
  const dims = {
    ...DEFAULT_DIMS,
    ...args,
  };
  return (
    <MockPage>
      <DAGGraphBoard
        closeModal={() => {}}
        state={{
          ready: true,
          data: {
            elements: {
              edges: [
                {
                  id: `${dims.flipped}-1`,
                  source: `${dims.flipped}-node`,
                  target: `${dims.flipped}-button`,
                },
              ],
              nodes: [
                SequenceNodeMaker.makeElement(
                  {
                    id: `${dims.flipped}-node`,
                    position: {
                      x: 0,
                      y: 0,
                    },
                  },
                  dims,
                  {
                    label: "test",
                    color: "lblue",
                    enabled: true,
                  }
                ),
                ButtonNodeMaker.makeElement(
                  {
                    id: `${dims.flipped}-button`,
                    position: !dims.flipped
                      ? {
                          x:
                            DEFAULT_DIMS.node.width *
                            DEFAULT_DIMS.distanceFactor.node[0],
                          y: 0,
                        }
                      : {
                          x: 0,
                          y:
                            DEFAULT_DIMS.node.height *
                            DEFAULT_DIMS.distanceFactor.node[1],
                        },
                  },
                  dims,
                  args
                ),
              ],
            },
          },
        }}
      />
    </MockPage>
  );
};

export const Basic = Template.bind({});
export const Text = Template.bind({});
Text.args = {
  ...Text.args,
  text: "Option",
};
