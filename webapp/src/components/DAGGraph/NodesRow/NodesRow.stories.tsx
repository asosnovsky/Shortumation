import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";
import { makeStory } from "devUtils";
import { NodesRow } from ".";
import { createUpdater } from "../updater/index";

const { make, componentMeta } = makeStory({
  Component: NodesRow,
  BaseTemplate: (props) => {
    const updater = createUpdater({
      openModal: () => {},
      action: {
        data: [],
        onUpdate: () => {},
      },
      condition: {
        data: [],
        onUpdate: () => {},
      },
      trigger: {
        data: [],
        onUpdate: () => {},
      },
    });
    return <NodesRow {...props} stateUpdater={updater} />;
  },
  meta: {
    title: "DAGGraph/NodesRow/Single",
    args: {
      type: "trigger",
      data: [],
      sequenceNodeDims: DEFAULT_DIMS.node,
    },
  },
});

export default componentMeta;
export const Empty = make({});
export const One = make({
  data: [
    {
      platform: "calendar",
      event: "start",
    },
  ],
});
export const Many = make({
  data: [
    {
      platform: "calendar",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
    {
      platform: "homeassistant",
      event: "start",
    },
  ].map((n, id) => ({
    ...n,
    id: `Trigger ${id}`,
  })),
});
