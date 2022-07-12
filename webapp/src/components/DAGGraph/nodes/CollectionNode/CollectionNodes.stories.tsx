import React, { FC } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { CollectionNode } from "./CollectionNode";
import { DAGGraphBoard } from "components/DAGGraph/board";
import { CollectionNodeMaker } from "./index";
import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";

const Demo: FC<{
  height: number;
  width: number;
  totalChildNodes: number;
  onAddNode: () => void;
  enabledChild: boolean;
}> = (args) => {
  return (
    <Page>
      <DAGGraphBoard
        closeModal={() => {}}
        state={{
          ready: true,
          data: {
            elements: {
              edges: [],
              nodes: ["trogger", "sequence", "condition"].map(
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
    ...DEFAULT_DIMS.condition,
    totalChildNodes: 1,
    enabledChild: true,
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
