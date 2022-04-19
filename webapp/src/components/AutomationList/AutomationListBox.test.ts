import { groupAutomations } from './AutomationListBox';
import { AutomationData } from 'types/automations/index';

test('converting time to a string', () => {
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
    expect(groupAutomations(automations, [0, 1], ['Room', "Type"])).toBe({
        "Living Room": {
            "Lights": ["1"],
            "Climate": ["2"],
        },
        "Kitchen": {
            "Climate": ["3"],
        }
    })
    expect(groupAutomations(automations, [1, 0], ['Room', "Type"])).toBe({
        "Lights": {
            "Living Room": ['1'],
        },
        "Climate": {
            "Living Room": ['2'],
            "Kitchen": ['3']
        }
    })
    expect(groupAutomations(automations, [1], ['Room', "Type"])).toBe({
        "Lights": ['1'],
        "Climate": ['2', '3']
    })
    expect(groupAutomations(automations, [0], ['Room', "Type"])).toBe({
        "Living Room": ['1', '2'],
        "Kitchen": ['3']
    })
});
