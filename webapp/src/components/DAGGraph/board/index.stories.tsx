import { DAGGraphBoard } from ".";
import { SimpleErrorElement } from "components/SimpleErrorElement";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: DAGGraphBoard,
  meta: {
    title: "DAGGraph/Board",
  },
});

export default componentMeta;

export const Loading = make({
  state: {
    ready: false,
  },
});

export const Errored = make({
  state: {
    ready: true,
    data: {
      error: <SimpleErrorElement error={new Error("Test")} />,
    },
  },
});

export const Empty = make({
  state: {
    ready: true,
    data: {
      elements: {
        nodes: [],
        edges: [],
      },
    },
  },
});

export const Basic = make({
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
});
