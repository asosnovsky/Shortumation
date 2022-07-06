import { AutomationSequenceNode } from "types/automations";
import { ModalState } from "./types";
import { makeDagFlowUpdate } from "./DAGFlowUpdater";
import { AutomationTrigger } from "types/automations/triggers";
import { AutomationCondition } from "types/automations/conditions";

const mockDAGFlowUpdater = (
  initialSequences: AutomationSequenceNode[] = [],
  initialTriggers: AutomationTrigger[] = [],
  initialConditions: AutomationCondition[] = []
) => {
  let sequence = [...initialSequences];
  let trigger = [...initialTriggers];
  let condition = [...initialConditions];
  const modalStates: ModalState[] = [];

  const updater = makeDagFlowUpdate({
    sequence,
    trigger,
    condition,
    openModal: (m) => {
      modalStates.push(m);
    },
    onTriggerUpdate: (t) => {
      trigger = [...t];
    },
    onSequenceUpdate: (s) => {
      sequence = [...s];
    },
    onConditionUpdate: (c) => {
      condition = [...c];
    },
  });
  return {
    get condition() {
      return condition;
    },
    get trigger() {
      return trigger;
    },
    get sequence() {
      return sequence;
    },
    get modalStates() {
      return modalStates;
    },
    updater,
  };
};

test("DAGFlowUpdater.onaddNode add node when we have nothing", () => {
  const emptyMock = mockDAGFlowUpdater();
  emptyMock.updater.addNode(null, "sequence");
  expect(emptyMock.modalStates.length).toEqual(1);
  emptyMock.modalStates[0].update({
    device_id: "testme",
  });
  expect((emptyMock.sequence[0] as any).device_id).toEqual("testme");
});

test("DAGFlowUpdater.onaddNode add node to end when we have 1 thing", () => {
  const mock = mockDAGFlowUpdater([
    {
      choose: [],
    },
  ]);
  mock.updater.addNode(null, "sequence");
  expect(mock.modalStates.length).toEqual(1);
  mock.modalStates[0].update({
    device_id: "testme",
  });
  expect(mock.sequence.length).toEqual(2);
  expect((mock.sequence[1] as any).device_id).toEqual("testme");
});

test("DAGFlowUpdater.onaddNode add node to start when we have 1 thing", () => {
  const mock = mockDAGFlowUpdater([
    {
      choose: [],
    },
  ]);
  mock.updater.addNode(0, "sequence");
  expect(mock.modalStates.length).toEqual(1);
  mock.modalStates[0].update({
    device_id: "testme",
  });
  expect(mock.sequence.length).toEqual(2);
  expect((mock.sequence[0] as any).device_id).toEqual("testme");
});

test("DAGFlowUpdater.onaddNode add node to start when we have many things", () => {
  const mock = mockDAGFlowUpdater([
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
  ]);
  mock.updater.addNode(0, "sequence");
  expect(mock.modalStates.length).toEqual(1);
  mock.modalStates[0].update({
    device_id: "testme",
  });
  expect(mock.sequence.length).toEqual(8);
  expect((mock.sequence[0] as any).device_id).toEqual("testme");
});

test("DAGFlowUpdater.onaddNode add node to middle when we have many things", () => {
  const mock = mockDAGFlowUpdater([
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
    {
      choose: [],
    },
  ]);
  mock.updater.addNode(2, "sequence");
  expect(mock.modalStates.length).toEqual(1);
  mock.modalStates[0].update({
    device_id: "testme",
  });
  expect(mock.sequence.length).toEqual(8);
  expect((mock.sequence[2] as any).device_id).toEqual("testme");
});
