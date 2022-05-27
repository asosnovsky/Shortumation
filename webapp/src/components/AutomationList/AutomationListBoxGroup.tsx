
import { TrashIcon } from "components/Icons";
import { Button } from "components/Inputs/Button";
import { MetadataBox } from "./AutomationMetadataBox";
import { AutomationData } from "types/automations";
import { AutomationGrouping } from "./automationGrouper";
import { FC, useState } from "react";

export type AutomationListBoxEvents = {
    onSelectAutomation: (i: number) => void,
    onRemove: (i: number) => void,
}
export type AutomationListBoxGroups = {
    grouping: AutomationGrouping,
    currentNode: number,
}
export type AutomationListBoxProps = {
    events: AutomationListBoxEvents,
    groups: AutomationListBoxGroups,
    autos: Array<[AutomationData, number]>,
    selectedAutomationIdx: number,
};
export type AutomationListBoxGroupProps = {
    events: AutomationListBoxEvents,
    grouping: AutomationGrouping,
    autos: Array<[AutomationData, number]>,
    selectedAutomationIdx: number,
}
export const AutomationListBoxGroup: FC<AutomationListBoxGroupProps> = ({
    events, grouping, autos, selectedAutomationIdx,
}) => {
    if (grouping.top.length === 1) {
        return <>
            {convertGroupsToItems(autos, {
                grouping, currentNode: grouping.top[0],
            }, events, selectedAutomationIdx)}
        </>
    } else {
        return <>
            {grouping.top.map(groupIdx => <AutomationListBoxGroupItem
                key={groupIdx}
                autos={autos}
                groups={{
                    grouping,
                    currentNode: groupIdx
                }}
                events={events}
                selectedAutomationIdx={selectedAutomationIdx}
            />)}
        </>
    }
}

export const convertGroupsToItems = (
    autos: Array<[AutomationData, number]>,
    { grouping, currentNode }: AutomationListBoxGroups,
    events: AutomationListBoxEvents,
    selectedAutomationIdx: number,
) => {
    const automations = grouping.getAutomations(currentNode);
    if (automations.length > 0) {
        return automations.map(autoIndex =>
            <AutomationListBoxItem
                key={`${autoIndex}-${autos[autoIndex][1]}`}
                events={events}
                auto={autos[autoIndex]}
                isSelected={selectedAutomationIdx === autos[autoIndex][1]}
            />
        )
    }
    const subgroups = grouping.getSubGroups(currentNode);
    if (subgroups.length > 0) {
        return subgroups.map(groupIdx => <AutomationListBoxGroupItem
            key={groupIdx}
            autos={autos}
            groups={{
                grouping,
                currentNode: groupIdx
            }}
            events={events}
            selectedAutomationIdx={selectedAutomationIdx}
        />)
    }
    return <></>
}

export const AutomationListBoxGroupItem: FC<{
    events: AutomationListBoxEvents,
    groups: AutomationListBoxGroups,
    autos: Array<[AutomationData, number]>,
    selectedAutomationIdx: number,
}> = ({
    autos, groups, events, selectedAutomationIdx,
}) => {
        const groupData = groups.grouping.getData(groups.currentNode);
        const automations = groups.grouping.getAutomations(groups.currentNode);
        const [open, setOpen] = useState(false);
        const isOther = groupData.isOther;
        const openIcon = !open ? "⊕" : "⊖";
        const total = isOther ? <small>
            {automations.length} automation{automations.length !== 1 ? 's' : ''} {groupData.isOther ? "" : "(untagged)"}
        </small> : <></>
        return <div className={[
            "automation-list-box--body--group",
            isOther ? 'other' : '',
            groupData.selected ? 'selected' : '',
        ].join(' ')}>
            <b onClick={() => setOpen(!open)}>{groupData.name} {openIcon} {total}</b>
            {open && convertGroupsToItems(autos, groups, events, selectedAutomationIdx)}
        </div>
    }


export const AutomationListBoxItem: FC<{
    auto: [AutomationData, number],
    isSelected: boolean,
    events: AutomationListBoxEvents,
}> = ({
    events: {
        onRemove,
        onSelectAutomation,
    },
    auto: [
        auto, autoIndex
    ],
    isSelected,
}) => {
        let title = "BadAuto<<Missing Metadata>>"
        if (auto.metadata) {
            title = `Name = ${auto.metadata.alias}\nID = ${auto.metadata.id}\nDescription = ${auto.metadata.description}`
        }
        return <div
            key={autoIndex}
            className={["automation-list-box--body--item", isSelected ? 'selected' : ''].join(' ')}
            title={title}
            onClick={() => onSelectAutomation(autoIndex)}
        >
            <MetadataBox metadata={auto.metadata} tags={auto.tags} />
            <Button onClick={() => onRemove(autoIndex)}><TrashIcon /></Button>
        </div>
    }