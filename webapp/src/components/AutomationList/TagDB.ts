import { AutomationData } from "types/automations";

export type TagDB = ReturnType<typeof makeTagDB>;
export const makeTagDB = (automations: AutomationData[]) => {
    const allTags: Record<string, string[]> = {};
    automations.forEach(({ tags }) =>
        Object.keys(tags).forEach(tagName => {
            const tagValue = tags[tagName];
            allTags[tagName] = (allTags[tagName] ?? []).concat([tagValue]);
        })
    );
    const allTagNames = Object.keys(allTags);
    return {
        getTagNames(myTags: string[]): string[] {
            return allTagNames.filter(n => !myTags.includes(n))
        },
        getTagValues(tagName: string): string[] {
            return allTags[tagName] ?? [];
        }
    }
}