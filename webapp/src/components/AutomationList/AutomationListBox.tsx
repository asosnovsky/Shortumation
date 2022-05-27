import "./AutomationListBox.css";
import { FC, useState } from 'react';
import { AutomationData, AutomationMetadata } from "types/automations";
import InputMultiSelect from "components/Inputs/InputMultiSelect";
import InputText from "components/Inputs/InputText";
import { Button } from "components/Inputs/Button";
import { makeGrouping } from "./automationGrouper";
import { AutomationListBoxGroup } from "./AutomationListBoxGroup";


export type Props = {
    automations: AutomationData[];
    selected: number;
    onSelectAutomation: (i: number) => void;
    onRemove: (i: number) => void;
    onAdd: () => void;
}

export const AutomationListBox: FC<Props> = ({
    automations,
    selected,
    onSelectAutomation,
    onAdd,
    onRemove,
}) => {

    const tags = getTagList(automations);
    const [searchText, setSearchText] = useState('');
    const [selectedTagIdx, setSelectedTagIdx] = useState<number[]>([]);
    const filteredAutomations = filterAutomations(automations, searchText, selectedTagIdx, tags);
    const grouping = makeGrouping(
        filteredAutomations.map(([a, _]) => a),
        selectedTagIdx.map(i => tags[i]),
        selected,
    )

    return <div className="automation-list-box">
        <div className="automation-list-box--nav">
            <InputText
                label="Search"
                value={searchText}
                onChange={setSearchText}
            />
            <InputMultiSelect
                label="Tags"
                selected={selectedTagIdx}
                onChange={setSelectedTagIdx}
                options={tags}
                max={3}
            />
        </div>
        <div className="automation-list-box--body">
            <AutomationListBoxGroup
                events={{
                    onSelectAutomation,
                    onRemove
                }}
                autos={filteredAutomations}
                grouping={grouping}
                selectedAutomationIdx={selected}
            />
        </div>
        <div className="automation-list-box--bottom">
            <Button onClick={onAdd}>Add</Button>
            <span>Showing Automations: {filteredAutomations.length} out of {automations.length}</span>
        </div>
    </div>
}


export const getTagList = (autos: AutomationData[]): string[] => Object.keys(autos
    .map(a => Object.keys(a.tags))
    .reduce((all: any, keys) => {
        for (const k of keys) {
            all[k] = 1
        }
        return all;
    }, {}))

const filterAutomations = (autos: AutomationData[], searchText: string, selected: number[], tags: string[]): Array<[AutomationData, number]> => autos.map<[AutomationData, number]>((a, i) => [a, i]).filter(([a, i]) => {
    if (!a.metadata) {
        return true
    }
    if (searchText.length > 0) {
        if (
            !(
                (a.metadata.description ?? "").toLocaleLowerCase().includes(searchText) ||
                (a.metadata.alias ?? "").toLocaleLowerCase().includes(searchText)
            )
        ) {
            return false
        }
    }
    return true
})
