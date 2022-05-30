import { AutomationData } from "types/automations";

export type TagDB = ReturnType<typeof makeTagDB>;
export const makeTagDB = (automations: AutomationData[]) => {
    const allTags: Record<string, Set<string>> = {};
    automations.forEach(({ tags }) =>
        Object.keys(tags).forEach(tagName => {
            const tagValue = tags[tagName];
            if (!allTags[tagName]) {
                allTags[tagName] = new Set()
            }
            allTags[tagName].add(tagValue);
        })
    );
    const allTagNames = Object.keys(allTags);
    return {
        getTagNames(myTags: string[]): string[] {
            return allTagNames.filter(n => !myTags.includes(n)).sort()
        },
        getTagValues(tagName: string): string[] {
            return allTags[tagName] ? Array.from(allTags[tagName].values()).sort() : [];
        }
    }
}