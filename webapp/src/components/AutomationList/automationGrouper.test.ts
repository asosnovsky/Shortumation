import { makeGrouping } from "./automationGrouper";
import { AutomationData } from 'types/automations/index';
import { bigMockAutoList, createMockAuto } from 'utils/mocks';

const automations: AutomationData[] = [
    createMockAuto({
        "Room": 'Living Room',
        "Type": 'Lights'
    }),
    createMockAuto({
        "Room": 'Living Room',
        "Type": 'Climate'
    }),
    createMockAuto({
        "Room": 'Kitchen',
        "Type": 'Climate'
    }),
    createMockAuto({
        "Type": 'Climate'
    }),
    createMockAuto({
        "Room": 'Living Room'
    }),
    createMockAuto({}),
];

test('no grouping', () => {
    const grouped = makeGrouping(automations, [], 0);
    expect(grouped.top).toStrictEqual([0])
    expect(grouped.getAutomations(0)).toStrictEqual([0, 1, 2, 3, 4, 5])
});
test('1 grouping', () => {
    const grouped = makeGrouping(automations, ["Room"], 0);
    expect(grouped.top).toHaveLength(3);
    expect(grouped.getAutomations(0)).toStrictEqual([0, 1, 4])
    expect(grouped.getAutomations(1)).toStrictEqual([2])
    expect(grouped.getAutomations(2)).toStrictEqual([3, 5])
});
test('2 groupings', () => {
    const grouped = makeGrouping(automations, ["Room", "Type"], 0);
    expect(grouped.top).toHaveLength(3);
    expect(grouped.getAutomations(grouped.top[0])).toHaveLength(0)
    expect(grouped.getSubGroups(grouped.top[0])).toHaveLength(3)
    expect(grouped.getAutomations(grouped.top[1])).toHaveLength(0)
    expect(grouped.getSubGroups(grouped.top[1])).toHaveLength(1)
    expect(grouped.getAutomations(grouped.top[2])).toHaveLength(2)
    expect(grouped.getSubGroups(grouped.top[2])).toHaveLength(0)
});
test('bigAutoList groupings has not duplicate ids', () => {
    const grouped = makeGrouping(bigMockAutoList, ['Room', "Remote"], 0);
    const flattenAndCount = (gid: number): Record<number, number[]> => {
        const subgroups = grouped.getSubGroups(gid);
        if (subgroups.length > 0) {
            return flattenAndConsolidate(subgroups)
        } else {
            return grouped.getAutomations(gid).reduce((sum: Record<number, number[]>, b) => {
                sum[b] = (sum[b] ?? []).concat(gid)
                return sum
            }, {})
        }
    }
    const flattenAndConsolidate = (gids: number[]): Record<number, number[]> => gids.map(flattenAndCount).reduce((a, b) => {
        for (const k of Object.keys(b).map(Number)) {
            a[k] = (a[k] ?? []).concat(b[k])
        }
        return a
    }, {})
    const countedAutos = flattenAndConsolidate(grouped.top)
    for (const key of Object.keys(countedAutos).map(Number)) {
        expect(countedAutos[key]).toHaveLength(1)
    }
})