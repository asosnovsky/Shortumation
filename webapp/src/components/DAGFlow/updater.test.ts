import { AutomationSequenceNode } from "types/automations"
import { ChooseAction } from "types/automations/actions";
import { ModalState } from "./types";
import { makeSequenceUpdater } from "./updater"

const mockSequenceUpdater = (defaultState: AutomationSequenceNode[] = []) => {
    let state: AutomationSequenceNode[] = [...defaultState]
    const modalStates: ModalState[] = [];

    const updater = makeSequenceUpdater(
        state,
        s => {
            state = s
        },
        ms => modalStates.push(ms)
    );
    return {
        get state() {
            return state
        },
        modalStates,
        updater
    };
}

test("sequence updater updates nodes", () => {
    const mock = mockSequenceUpdater([
        {
            "choose": [
                {
                    "conditions": [],
                    "sequence": [],
                }
            ],
            "default": [],
        }
    ]);
    expect(mock.state.length).toBe(1)
    expect((mock.state[0] as ChooseAction).alias).toBe(undefined)
    mock.updater.updateNode(0, {
        ...mock.state[0],
        alias: "Hello"
    } as any)
    expect((mock.state[0] as any).alias).toBe("Hello")
})
test('update conditions for node', () => {
    const mock = mockSequenceUpdater([
        {
            "choose": [
                {
                    "conditions": [],
                    "sequence": [],
                }
            ],
            "default": [],
        }
    ]);
    mock.updater.makeOnEditConditionsForChooseNode(0, 0)();

    expect(mock.modalStates.length).toBe(1)
    expect((mock.modalStates[0].node as AutomationSequenceNode[]).length).toBe(0)
    mock.modalStates[0].update([
        {
            "condition": "and",
            "conditions": [],
        }
    ] as any)
    expect((mock.state[0] as ChooseAction).choose[0].conditions.length).toBe(1)
    expect((mock.state[0] as ChooseAction).choose[0].conditions[0].condition).toBe("and")
})