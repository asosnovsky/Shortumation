import { Namer } from "utils/formatting";
import { makeTriggerNodes } from ".";
import { createUpdaterFromAutomationData } from "../updater";
import { DEFAULT_DIMS } from "./constants";
import { ElementMakerProps } from "./types";

const makeDummyArgs = (): ElementMakerProps => ({
  dims: DEFAULT_DIMS,
  elementData: {
    nodes: [],
    edges: [],
  },
  namer: {
    getDeviceName(device_id) {
      return device_id;
    },
    getServiceName(service) {
      return service;
    },
    getEntityName(entity_id, maxEntities = 1) {
      if (Array.isArray(entity_id)) {
        return entity_id.slice(0, maxEntities).join(" and ");
      } else {
        return entity_id;
      }
    },
  },
  nodeId: "t",
  nodeIndex: 0,
  stateUpdater: createUpdaterFromAutomationData(
    () => {},
    { condition: [], trigger: [], sequence: [] },
    () => {}
  ),
  position: { x: 0, y: 0 },
  openModal: () => {},
});

test("triggers bbox computed correctly -- one node", () => {
  const dummyArgs = makeDummyArgs();
  const state = makeTriggerNodes(
    [{ platform: "homeassistant", event: "up" }],
    dummyArgs
  );
  expect(state.elementData.nodes.length).toEqual(1);
  expect(state.bbox[0]).toStrictEqual({
    x: 0,
    y: 0,
  });
  expect(state.bbox[1]).toStrictEqual({
    y: DEFAULT_DIMS.node.height * 2,
    x: DEFAULT_DIMS.node.width,
  });
});

test("triggers bbox computed correctly -- many nodes", () => {
  const dummyArgs = makeDummyArgs();
  const state = makeTriggerNodes(
    [
      { platform: "homeassistant", event: "up" },
      { platform: "homeassistant", event: "up" },
      { platform: "homeassistant", event: "up" },
      { platform: "homeassistant", event: "up" },
      { platform: "homeassistant", event: "up" },
    ],
    dummyArgs
  );
  expect(state.elementData.nodes.length).toEqual(5);
  expect(state.bbox[0]).toStrictEqual({
    x: 0,
    y: 0,
  });
  expect(state.bbox[1]).toStrictEqual({
    y: DEFAULT_DIMS.node.height * 2,
    x: DEFAULT_DIMS.node.width * 6,
  });
});
