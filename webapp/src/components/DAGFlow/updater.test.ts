import { AutomationSequenceNode } from "types/automations";
import { ChooseAction } from "types/automations/actions";
import { ModalState } from "./types";
import { makeSequenceUpdater } from "./updater";

const mockSequenceUpdater = (defaultState: AutomationSequenceNode[] = []) => {
  let state: AutomationSequenceNode[] = [...defaultState];
  const modalStates: ModalState[] = [];

  const updater = makeSequenceUpdater(
    state,
    (s) => {
      state = s;
    },
    (ms) => modalStates.push(ms)
  );
  return {
    get state() {
      return state;
    },
    modalStates,
    updater,
  };
};

test("sequence updater updates nodes", () => {
  const mock = mockSequenceUpdater([
    {
      choose: [
        {
          conditions: [],
          sequence: [],
        },
      ],
      default: [],
    },
  ]);
  expect(mock.state.length).toBe(1);
  expect((mock.state[0] as ChooseAction).alias).toBe(undefined);
  mock.updater.updateNode(0, {
    ...mock.state[0],
    alias: "Hello",
  } as any);
  expect((mock.state[0] as any).alias).toBe("Hello");
});
