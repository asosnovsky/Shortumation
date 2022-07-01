import { TrashIcon } from "components/Icons";
import { MetadataBox } from "./AutomationMetadataBox";
import { AutomationData } from "types/automations";
import { AutomationGrouping } from "./automationGrouper";
import { FC, useState } from "react";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { TagDB } from "./TagDB";

export type AutomationListBoxEvents = {
  onSelectAutomation: (i: number) => void;
  onRemove: (i: number) => void;
};
export type AutomationListBoxGroups = {
  grouping: AutomationGrouping;
  currentNode: number;
};
export type AutomationListBoxProps = {
  events: AutomationListBoxEvents;
  groups: AutomationListBoxGroups;
  autos: Array<[AutomationData, number]>;
  selectedAutomationIdx: number;
};
export type AutomationListBoxGroupProps = {
  events: AutomationListBoxEvents;
  grouping: AutomationGrouping;
  autos: Array<[AutomationData, number]>;
  selectedAutomationIdx: number;
  tagsDB: TagDB;
};
export const AutomationListBoxGroup: FC<AutomationListBoxGroupProps> = ({
  events,
  grouping,
  autos,
  selectedAutomationIdx,
  tagsDB,
}) => {
  if (grouping.top.length === 1) {
    return (
      <>
        {convertGroupsToItems(
          autos,
          {
            grouping,
            currentNode: grouping.top[0],
          },
          events,
          selectedAutomationIdx,
          tagsDB
        )}
      </>
    );
  } else {
    return (
      <>
        {grouping.top.map((groupIdx) => (
          <AutomationListBoxGroupItem
            key={groupIdx}
            autos={autos}
            groups={{
              grouping,
              currentNode: groupIdx,
            }}
            events={events}
            selectedAutomationIdx={selectedAutomationIdx}
            tagsDB={tagsDB}
          />
        ))}
      </>
    );
  }
};

export const convertGroupsToItems = (
  autos: Array<[AutomationData, number]>,
  { grouping, currentNode }: AutomationListBoxGroups,
  events: AutomationListBoxEvents,
  selectedAutomationIdx: number,
  tagsDB: TagDB
) => {
  const automations = grouping.getAutomations(currentNode);
  if (automations.length > 0) {
    return automations.map((autoIndex) => (
      <AutomationListBoxItem
        key={`${autoIndex}-${autos[autoIndex][1]}`}
        events={events}
        auto={autos[autoIndex]}
        isSelected={selectedAutomationIdx === autos[autoIndex][1]}
        tagsDB={tagsDB}
      />
    ));
  }
  const subgroups = grouping.getSubGroups(currentNode);
  if (subgroups.length > 0) {
    return subgroups.map((groupIdx) => (
      <AutomationListBoxGroupItem
        key={groupIdx}
        autos={autos}
        groups={{
          grouping,
          currentNode: groupIdx,
        }}
        events={events}
        selectedAutomationIdx={selectedAutomationIdx}
        tagsDB={tagsDB}
      />
    ));
  }
  return <></>;
};

export const AutomationListBoxGroupItem: FC<{
  events: AutomationListBoxEvents;
  groups: AutomationListBoxGroups;
  autos: Array<[AutomationData, number]>;
  selectedAutomationIdx: number;
  tagsDB: TagDB;
}> = ({ autos, groups, events, selectedAutomationIdx, tagsDB }) => {
  const groupData = groups.grouping.getData(groups.currentNode);
  const automations = groups.grouping.getAutomations(groups.currentNode);
  const [open, setOpen] = useState(false);
  const isOther = groupData.isOther;
  const openIcon = !open ? "⊕" : "⊖";
  const total = isOther ? (
    <small>
      {automations.length} automation{automations.length !== 1 ? "s" : ""}{" "}
      {groupData.isOther ? "" : "(untagged)"}
    </small>
  ) : (
    <></>
  );
  return (
    <div
      className={[
        "automation-list-box--body--group",
        isOther ? "other" : "",
        groupData.selected ? "selected" : "",
      ].join(" ")}
    >
      <b onClick={() => setOpen(!open)}>
        {groupData.name} {openIcon} {total}
      </b>
      {open &&
        convertGroupsToItems(
          autos,
          groups,
          events,
          selectedAutomationIdx,
          tagsDB
        )}
    </div>
  );
};

export const AutomationListBoxItem: FC<{
  auto: [AutomationData, number];
  isSelected: boolean;
  events: AutomationListBoxEvents;
  tagsDB: TagDB;
}> = ({
  events: { onRemove, onSelectAutomation },
  auto: [auto, autoIndex],
  isSelected,
  tagsDB,
}) => {
  let title = "BadAuto<<Missing Metadata>>";
  if (auto.metadata) {
    title = `Name = ${auto.metadata.alias}\nID = ${auto.metadata.id}\nDescription = ${auto.metadata.description}`;
  }
  return (
    <div
      key={autoIndex}
      className={[
        "automation-list-box--body--item",
        isSelected ? "selected" : "",
      ].join(" ")}
      title={title}
      onClick={() => onSelectAutomation(autoIndex)}
    >
      <MetadataBox metadata={auto.metadata} tags={auto.tags} tagsDB={tagsDB} />
      <ButtonIcon onClick={() => onRemove(autoIndex)} icon={<TrashIcon />} />
    </div>
  );
};
