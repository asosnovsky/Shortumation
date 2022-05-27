import { AutomationData } from "types/automations";

const makeGrouper = () => {
    const groupIdNames: string[] = []
    const groupSubGroups: number[][] = []
    const groupAutomations: number[][] = []
    const groupData: Array<{
        name: string;
        selected: boolean;
    }> = [];
    const topGroups: number[] = [];

    return {
        groupIdNames,
        groupSubGroups,
        groupAutomations,
        groupData,
        topGroups,
        addNew(groupId: string, groupName: string, theChosenOne: boolean, isTopLevel: boolean): number {
            groupIdNames.push(groupId);
            groupSubGroups.push([]);
            groupAutomations.push([]);
            groupData.push({
                name: groupName,
                selected: theChosenOne,
            })
            const groupIdx = groupIdNames.length - 1;
            if (isTopLevel) {
                topGroups.push(groupIdx);
            }
            return groupIdx;
        },
        updateGroup(
            groupIdx: number,
            update: {
                isChosen: boolean,
                lastGroupIdx: number | null,
                autoIdx: number | null,
            }
        ) {
            if (update.isChosen) {
                groupData[groupIdx].selected = true;
            }
            if (update.lastGroupIdx !== null) {
                groupSubGroups[update.lastGroupIdx].push(groupIdx);
            }
            if (update.autoIdx !== null) {
                groupAutomations[groupIdx].push(update.autoIdx)
            }
        }
    }
}

export type AutomationGrouper = ReturnType<typeof makeGrouping>;
export const makeGrouping = (
    autos: AutomationData[],
    selectedTags: string[],
    selectedAutomationIdx: number,
) => {
    const grouper = makeGrouper();

    if (selectedTags.length === 0) {
        grouper.addNew("$", "", selectedAutomationIdx >= 0, true)
        grouper.groupAutomations = [autos.map((_, i) => i)];
    } else {
        autos.forEach((auto, autoIdx) => {
            const theChosenOne = selectedAutomationIdx === autoIdx;
            let lastGroupIdx: number | null = null;
            for (let ti = 0; ti < selectedTags.length; ti++) {
                const isTopLevel = ti === 0;
                const selTag = selectedTags[ti];
                if (selTag in auto.tags) {
                    const groupName = auto.tags[selTag];
                    const groupId = `${selTag}:${groupName}`;
                    let groupIdx = grouper.groupIdNames.indexOf(groupId);
                    if (groupIdx < 0) {
                        groupIdx = grouper.addNew(groupId, groupName, theChosenOne, isTopLevel);
                    }
                    grouper.updateGroup(groupIdx, {
                        isChosen: theChosenOne,
                        lastGroupIdx,
                        autoIdx: ti === selectedTags.length - 1 ? autoIdx : null,
                    })
                    lastGroupIdx = groupIdx;
                } else {
                    let groupIdx = grouper.groupIdNames.indexOf(`${selTag}:$`);
                    if (groupIdx < 0) {
                        groupIdx = grouper.addNew(`${selTag}:$`, "", theChosenOne, isTopLevel);
                    }
                    grouper.updateGroup(groupIdx, {
                        isChosen: theChosenOne,
                        lastGroupIdx,
                        autoIdx,
                    })
                    break
                }
            }
        });
    }

    console.log(grouper)
    return {
        top: grouper.topGroups,
        getSubGroups(groupIdx: number) {
            return grouper.groupSubGroups[groupIdx]
        },
        getAutomations(groupIdx: number) {
            return grouper.groupAutomations[groupIdx]
        },
        getData(groupIdx: number) {
            return grouper.groupData[groupIdx]
        }
    }
}


