import React, { FC } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { CollectionNode } from "./CollectionNode";
import { DAGGraphBoard } from "components/DAGGraph/board";
import { CollectionNodeMaker } from "./index";
import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";
import { ButtonNodeMaker } from "../ButtonNode";
import { AddCircle } from "@mui/icons-material";
import { MarkerType } from "react-flow-renderer";

type DemoProps = {
  height: number;
  width: number;
  totalChildNodes: number;
  onAddNode: () => void;
  hasDelete: boolean;
  enabledChild: boolean;
};
const Demo: FC<DemoProps> = (args) => {
  return (
    <Page>
      <DAGGraphBoard
        closeModal={() => {}}
        state={{
          ready: true,
          data: {
            elements: {
              edges: [],
              nodes: ["trigger", "sequence", "condition"].map(
                (collectionType: any, i: number) =>
                  CollectionNodeMaker.makeElement(
                    {
                      id: collectionType,
                      position: {
                        x: 50 + args.width * (i % 3 === 0 ? 1 : 0),
                        y: 50 + args.height * ((i + 1) % 2 === 0 ? 1 : 0),
                      },
                    },
                    DEFAULT_DIMS,
                    {
                      hasInput: false,
                      onAddNode: args.onAddNode,
                      onDelete: args.hasDelete ? console.info : undefined,
                      width: args.width,
                      height: args.height,
                      nodes: [
                        {
                          enabled: args.enabledChild,
                          label: collectionType,
                        },
                        ...Array.from(Array(args.totalChildNodes)).map(
                          (_, i) => ({
                            enabled: true,
                            label: `Dummy Node #${i + 1}`,
                          })
                        ),
                      ],
                      collectionType,
                    }
                  )
              ),
            },
          },
        }}
      />
    </Page>
  );
};

export default {
  title: "DAGGraph/Nodes/Collection",
  component: Demo,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    ...DEFAULT_DIMS.collection,
    totalChildNodes: 1,
    enabledChild: true,
    hasDelete: false,
  },
} as ComponentMeta<typeof Demo>;

export const Colors: ComponentStory<typeof Demo> = (args) => <Demo {...args} />;

export const Empty: ComponentStory<typeof Demo> = (args) => {
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
                CollectionNodeMaker.makeElement(
                  {
                    id: "only-one",
                    position: {
                      x: 50,
                      y: 50,
                    },
                  },
                  DEFAULT_DIMS,
                  {
                    hasInput: false,
                    onDelete: args.hasDelete ? console.info : undefined,
                    onAddNode: args.onAddNode,
                    width: args.width,
                    height: args.height,
                    nodes: [
                      ...Array.from(Array(args.totalChildNodes)).map(
                        (_, i) => ({
                          enabled: true,
                          label: `Dummy Node #${i + 1}`,
                        })
                      ),
                    ],
                    collectionType: "condition",
                  }
                ),
              ],
            },
          },
        }}
      />
    </Page>
  );
};

Empty.args = {
  ...Empty.args,
  totalChildNodes: 0,
};

export const ReturnTarget: ComponentStory<typeof Demo> = (args) => {
  return (
    <Page>
      <DAGGraphBoard
        closeModal={() => {}}
        state={{
          ready: true,
          data: {
            elements: {
              edges: [
                {
                  id: "1",
                  source: "root",
                  target: "btn",
                  label: "1",
                },
                {
                  id: "2",
                  target: "root",
                  source: "btn",
                  animated: true,
                  targetHandle: "return",
                  label: "2",
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 25,
                    height: 25,
                  },
                },
                {
                  id: "3",
                  target: "root",
                  source: "btn",
                  label: "3",
                },
              ],
              nodes: [
                ButtonNodeMaker.makeElement(
                  {
                    id: "btn",
                    position: {
                      x: 50 + (args.width - DEFAULT_DIMS.node.width) / 2,
                      y:
                        50 +
                        args.height *
                          2 *
                          DEFAULT_DIMS.distanceFactor.collection,
                    },
                  },
                  DEFAULT_DIMS,
                  {
                    icon: <AddCircle />,
                    onClick: () => {},
                  }
                ),
                CollectionNodeMaker.makeElement(
                  {
                    id: "root",
                    position: {
                      x: 50,
                      y: 50,
                    },
                  },
                  DEFAULT_DIMS,
                  {
                    onDelete: args.hasDelete ? console.info : undefined,
                    onAddNode: args.onAddNode,
                    width: args.width,
                    height: args.height,
                    nodes: [
                      {
                        enabled: args.enabledChild,
                        label: "condition",
                      },
                      ...Array.from(Array(args.totalChildNodes)).map(
                        (_, i) => ({
                          enabled: true,
                          label: `Dummy Node #${i + 1}`,
                        })
                      ),
                    ],
                    collectionType: "condition",
                  }
                ),
              ],
            },
          },
        }}
      />
    </Page>
  );
};

export const DeleteIconExample = Empty.bind({});
DeleteIconExample.args = {
  ...DeleteIconExample.args,
  hasDelete: true,
};
