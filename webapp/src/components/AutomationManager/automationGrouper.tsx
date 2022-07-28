import { AutomationManagerAuto, AutomationManagerItem } from "./types";

const makeGrouper = () => {
  const groupIdNames: string[] = [];
  const groupSubGroups: Array<Set<number>> = []; // groupIdx => Array<groupIdx>
  const groupAutomations: number[][] = []; // groupIdx => Array<automationIdx>
  const groupData: Array<{
    name: string;
    selected: boolean;
    isOther: boolean;
    isTop: boolean;
  }> = []; // source of truth for groupIdx
  const topGroups: number[] = [];

  return {
    groupIdNames,
    groupSubGroups,
    groupAutomations,
    groupData,
    topGroups,
    addNew(
      groupId: string,
      groupName: string,
      theChosenOne: boolean,
      isTopLevel: boolean,
      isOther: boolean = false
    ): number {
      groupIdNames.push(groupId);
      groupSubGroups.push(new Set());
      groupAutomations.push([]);
      groupData.push({
        name: groupName,
        selected: theChosenOne,
        isTop: isTopLevel,
        isOther,
      });
      const groupIdx = groupIdNames.length - 1;
      if (isTopLevel) {
        topGroups.push(groupIdx);
      }
      return groupIdx;
    },
    updateGroup(
      groupIdx: number,
      update: {
        isChosen: boolean;
        lastGroupIdx: number | null;
        autoIdx: number | null;
      }
    ) {
      if (update.isChosen) {
        groupData[groupIdx].selected = true;
      }
      if (update.lastGroupIdx !== null) {
        groupSubGroups[update.lastGroupIdx].add(groupIdx);
      }
      if (update.autoIdx !== null) {
        groupAutomations[groupIdx].push(update.autoIdx);
      }
    },
  };
};

export type AutomationGrouping = ReturnType<typeof makeGrouping>;
export const makeGrouping = (
  autos: AutomationManagerAuto[],
  selectedTags: string[],
  selectedAutomationId: string | null
) => {
  const grouper = makeGrouper();

  if (selectedTags.length === 0) {
    grouper.addNew("$", "", selectedAutomationId !== null, true, true);
    grouper.groupAutomations = [autos.map((_, i) => i)];
  } else {
    autos.forEach((auto, autoIdx) => {
      const theChosenOne = selectedAutomationId === auto.id;
      let lastGroupIdx: number | null = null;
      let lastGroupId: string = "$";
      for (let ti = 0; ti < selectedTags.length; ti++) {
        const isTopLevel = ti === 0;
        const selTag = selectedTags[ti];
        if (selTag in auto.tags) {
          const groupName = auto.tags[selTag];
          const groupId = `${lastGroupId}>${selTag}:${groupName}`;
          let groupIdx = grouper.groupIdNames.indexOf(groupId);
          if (groupIdx < 0) {
            groupIdx = grouper.addNew(
              groupId,
              groupName,
              theChosenOne,
              isTopLevel
            );
          }
          grouper.updateGroup(groupIdx, {
            isChosen: theChosenOne,
            lastGroupIdx,
            autoIdx: ti === selectedTags.length - 1 ? autoIdx : null,
          });
          lastGroupIdx = groupIdx;
          lastGroupId = groupId;
        } else {
          const groupId = `${lastGroupId}>${selTag}:$`;
          let groupIdx = grouper.groupIdNames.indexOf(groupId);
          if (groupIdx < 0) {
            groupIdx = grouper.addNew(
              groupId,
              "",
              theChosenOne,
              isTopLevel,
              true
            );
          }
          grouper.updateGroup(groupIdx, {
            isChosen: theChosenOne,
            lastGroupIdx,
            autoIdx,
          });
          break;
        }
      }
    });
  }
  const sortGroupIds = (groupIds: number[]) =>
    groupIds.sort((a, b) => {
      const adata = grouper.groupData[a];
      const bdata = grouper.groupData[b];
      if (adata.isOther) {
        return 1;
      } else {
        return adata.name > bdata.name ? -1 : 1;
      }
    });
  return {
    top: sortGroupIds(grouper.topGroups),
    getSubGroups(groupIdx: number) {
      return sortGroupIds(
        Array.from(grouper.groupSubGroups[groupIdx].values())
      );
    },
    getAutomations(groupIdx: number) {
      return grouper.groupAutomations[groupIdx];
    },
    getData(groupIdx: number) {
      return grouper.groupData[groupIdx];
    },
  };
};

export const convertGroupingToItems = (
  currentGroupIdx: number,
  selectedAutomationId: string | null,
  autos: AutomationManagerAuto[],
  grouping: AutomationGrouping
): AutomationManagerItem => {
  const groupData = grouping.getData(currentGroupIdx);
  const automationIds = grouping.getAutomations(currentGroupIdx);

  if (automationIds.length > 0) {
    return {
      type: "items",
      title: groupData.name,
      data: automationIds.map((i) => {
        return {
          ...autos[i],
          isSelected: autos[i].id === selectedAutomationId,
        };
      }),
      isSelected: groupData.selected,
    };
  }
  const subgroups = grouping.getSubGroups(currentGroupIdx);
  return {
    type: "group",
    title: groupData.name,
    data: subgroups.map((i) =>
      convertGroupingToItems(i, selectedAutomationId, autos, grouping)
    ),
    isSelected: groupData.selected,
  };
};
