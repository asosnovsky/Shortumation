import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DAGGraphBoard } from ".";
import { Page } from "components/Page";
import { SimpleErrorElement } from "components/SimpleErrorElement";

export default {
  title: "DAGGraph/Board",
  component: DAGGraphBoard,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {},
} as ComponentMeta<typeof DAGGraphBoard>;

const Template: ComponentStory<typeof DAGGraphBoard> = (args) => {
  return (
    <Page>
      <DAGGraphBoard {...args} />
    </Page>
  );
};

export const Loading = Template.bind({});
Loading.args = {
  ...Loading.args,
  state: {
    ready: false,
  },
};

export const Errored = Template.bind({});
Errored.args = {
  ...Loading.args,
  state: {
    ready: true,
    data: {
      error: <SimpleErrorElement error={new Error("Test")} />,
    },
  },
};

export const Empty = Template.bind({});
Empty.args = {
  ...Empty.args,
  state: {
    ready: true,
    data: {
      elements: {
        nodes: [],
        edges: [],
      },
    },
  },
};

export const Basic = Template.bind({});
Basic.args = {
  ...Basic.args,
  state: {
    ready: true,
    data: {
      elements: {
        nodes: [
          {
            position: { x: 50, y: 50 },
            id: "1",
            data: {
              label: "hi",
            },
          },
          {
            position: { x: 500, y: 200 },
            id: "2",
            data: {
              label: "hi",
            },
          } as any,
        ],
        edges: [
          { id: "1->2", source: "1", target: "2", label: "wow" },
          {
            id: "2->1",
            source: "2",
            target: "1",
            label: "yes",
            animated: true,
          },
        ],
      },
    },
  },
};
