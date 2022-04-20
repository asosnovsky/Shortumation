import { groupAutomations, getTagList } from './AutomationListBox';
import { AutomationData } from 'types/automations/index';
import { createMockAuto } from 'utils/mocks';

test('group automations', () => {
    const automations: AutomationData[] = [
        {
            metadata: {
                id: '1',
                alias: '',
                description: '',
                mode: 'single',
                tags: {
                    "Room": 'Living Room',
                    "Type": 'Lights'
                }
            },
            sequence: [],
            trigger: [],
        },
        {
            metadata: {
                id: '2',
                alias: '',
                description: '',
                mode: 'single',
                tags: {
                    "Room": 'Living Room',
                    "Type": 'Climate'
                }
            },
            sequence: [],
            trigger: [],
        },
        {
            metadata: {
                id: '3',
                alias: '',
                description: '',
                mode: 'single',
                tags: {
                    "Room": 'Kitchen',
                    "Type": 'Climate'
                }
            },
            sequence: [],
            trigger: [],
        },
    ];
    expect(groupAutomations(automations, [0, 1], ['Room', "Type"])).toStrictEqual({
        "Living Room": {
            "Lights": [0],
            "Climate": [1],
        },
        "Kitchen": {
            "Climate": [2],
        }
    })
    expect(groupAutomations(automations, [1, 0], ['Room', "Type"])).toStrictEqual({
        "Lights": {
            "Living Room": [0],
        },
        "Climate": {
            "Living Room": [1],
            "Kitchen": [2]
        }
    })
    expect(groupAutomations(automations, [1], ['Room', "Type"])).toStrictEqual({
        "Lights": [0],
        "Climate": [1, 2]
    })
    expect(groupAutomations(automations, [0], ['Room', "Type"])).toStrictEqual({
        "Living Room": [0, 1],
        "Kitchen": [2]
    })


    expect(groupAutomations(automations, [], ['Room', "Type"])).toStrictEqual([
        0, 1, 2
    ])
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