import { getTagList } from './AutomationListBox';
import { createMockAuto } from 'utils/mocks';

// const makeDummy = (id: string, tags: Record<string, string>) => ({
//     condition: [],
//     metadata: {
//         id,
//         alias: '',
//         description: '',
//         mode: 'single',
//     },
//     tags,
//     sequence: [],
//     trigger: [],
// })

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