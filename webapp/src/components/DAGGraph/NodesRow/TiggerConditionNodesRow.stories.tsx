import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";
import { makeStory } from "devUtils";
import { createUpdater } from "../updater";
import { TriggerConditionNodeRow } from ".";

const { make, componentMeta } = makeStory({
  Component: TriggerConditionNodeRow,
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
    return <TriggerConditionNodeRow {...props} stateUpdater={updater} />;
  },
  meta: {
    title: "DAGGraph/NodesRow/TriggerAndConditions",
    args: {
      condition: [],
      trigger: [],
      sequenceNodeDims: DEFAULT_DIMS.node,
    },
  },
});

export default componentMeta;
export const Empty = make({});
export const One = make({
  trigger: [
    {
      platform: "calendar",
      event: "start",
    },
  ],
  condition: [
    {
      condition: "and",
      conditions: [],
    },
  ],
});
export const Many = make({
  trigger: [
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
  ],
});
