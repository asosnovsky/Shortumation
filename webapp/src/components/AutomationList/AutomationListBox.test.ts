import { groupAutomations, getTagList } from './AutomationListBox';
import { AutomationData } from 'types/automations/index';
import { createMockAuto } from 'utils/mocks';

const makeDummy = (id: string, tags: Record<string, string>) => ({
    condition: [],
    metadata: {
        id,
        alias: '',
        description: '',
        mode: 'single',
    },
    tags,
    sequence: [],
    trigger: [],
})

test('group automations', () => {
    const automations: AutomationData[] = [
        makeDummy('1', {
            "Room": 'Living Room',
            "Type": 'Lights'
        }),
        makeDummy('2', {
            "Room": 'Living Room',
            "Type": 'Climate'
        }),
        makeDummy('3', {
            "Room": 'Kitchen',
            "Type": 'Climate'
        }),
        makeDummy('4', {
            "Type": 'Climate'
        }),
        makeDummy('5', {
            "Room": 'Living Room'
        }),
        makeDummy('6', {}),
    ];
    expect(groupAutomations(automations, [], ['Room', "Type"])).toStrictEqual([
        0, 1, 2, 3, 4, 5,
    ])
    expect(groupAutomations(automations, [1], ['Room', "Type"])).toStrictEqual({
        "Lights": [0],
        "Climate": [1, 2, 3],
        "": [4, 5]
    })
    expect(groupAutomations(automations, [0], ['Room', "Type"])).toStrictEqual({
        "Living Room": [0, 1, 4],
        "Kitchen": [2],
        "": [3, 5]
    })
    expect(groupAutomations(automations, [0, 1], ['Room', "Type"])).toStrictEqual({
        "Living Room": {
            "Lights": [0],
            "Climate": [1],
            "": [4],
        },
        "Kitchen": {
            "Climate": [2],
        },
        "": [3, 5]
    })
    expect(groupAutomations(automations, [1, 0], ['Room', "Type"])).toStrictEqual({
        "Lights": {
            "Living Room": [0],
        },
        "Climate": {
            "Living Room": [1],
            "Kitchen": [2],
            "": [3],
        },
        "": [4, 5]
    })
});


test('getTagList', () => {
    expect(getTagList([
        createMockAuto(),
        createMockAuto(),
        createMockAuto(),
        createMockAuto(),
    ])).toStrictEqual([])

    expect(getTagList([
        createMockAuto({ "Room": "Kitchen", "Area": "Oven" }),
        createMockAuto({ "Room": "Attic" }),
        createMockAuto({ "Room": "Office" }),
        createMockAuto({ "Area": "Balcony" }),
    ])).toStrictEqual(["Room", "Area"])
})