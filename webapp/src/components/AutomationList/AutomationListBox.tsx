import "./AutomationListBox.css";
import { FC, useState } from 'react';
import { AutomationData } from "types/automations";
import InputMultiSelect from "components/Inputs/InputMultiSelect";
import InputText from "components/Inputs/InputText";
import { Button } from "components/Inputs/Button";


export type Props = {
    automations: AutomationData[];
    onSelectAutomation: (i: number) => void;
    onAdd: () => void;
}

export const AutomationListBox: FC<Props> = ({
    automations,
    onSelectAutomation,
    onAdd,
}) => {

    const tags = getTagList(automations);
    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const filteredAutomations = filterAutomations(automations, searchText, selected, tags);
    const groups = groupAutomations(filteredAutomations.map(([a, _]) => a), selected, tags);

    return <div className="automation-list-box">
        <div className="automation-list-box--nav">
            <InputText
                label="Search"
                value={searchText}
                onChange={setSearchText}
            />
            <InputMultiSelect
                label="Tags"
                selected={selected}
                onChange={setSelected}
                options={tags}
            />
        </div>
        <div className="automation-list-box--body">
            {convertGroupsToItems(groups, filteredAutomations, onSelectAutomation)}
        </div>
        <div className="automation-list-box--bottom">
            <Button onClick={onAdd}>Add</Button>
            <span>Showing Automations: {filteredAutomations.length} out of {automations.length}</span>
        </div>
    </div>
}


export const getTagList = (autos: AutomationData[]): string[] => Object.keys(autos
    .map(a => Object.keys(a.metadata.tags))
    .reduce((all: any, keys) => {
        for (const k of keys) {
            all[k] = 1
        }
        return all;
    }, {}))

const filterAutomations = (autos: AutomationData[], searchText: string, selected: number[], tags: string[]): Array<[AutomationData, number]> => autos.map<[AutomationData, number]>((a, i) => [a, i]).filter(([a, i]) => {
    if (searchText.length > 0) {
        if (
            !(
                a.metadata.description.toLocaleLowerCase().includes(searchText) ||
                a.metadata.alias.toLocaleLowerCase().includes(searchText)
            )
        ) {
            return false
        }
    }
    if (selected.length > 0) {
        for (const i of selected) {
            if (!a.metadata.tags[tags[i]]) {
                return false
            }
        }
    }
    return true
})


export const groupAutomations = (
    autos: AutomationData[],
    selected: number[],
    tags: string[],
) => {
    if (selected.length === 0) {
        return autos.map((_, i) => i);
    }
    const out: any = {};
    for (let ai = 0; ai < autos.length; ai++) {
        const a = autos[ai];
        let where = out;
        let tag: string = '';
        let lastKey: string | null = null;
        for (const i of selected) {
            tag = tags[i];
            if (lastKey !== null) {
                where = where[lastKey]
            }
            if (!where[a.metadata.tags[tag]]) {
                where[a.metadata.tags[tag]] = {}
            }
            lastKey = a.metadata.tags[tag]
        }
        if (lastKey !== null) {
            if (!where[lastKey] || !Array.isArray(where[lastKey])) {
                where[lastKey] = []
            }
            where[lastKey].push(ai)
        }
    }
    return out;
}

const convertGroupsToItems = (
    groups: any,
    autos: Array<[AutomationData, number]>,
    onSelectAutomation: (i: number) => void,
) => {
    if (Array.isArray(groups)) {
        return groups.map(i => <div key={i} className="automation-list-box--body--item" onClick={() => onSelectAutomation(autos[i][1])}>
            {autos[i][0].metadata.id} {autos[i][0].metadata.alias}
        </div>)
    } else {
        return Object.keys(groups).map(groupName => {
            return <AutomationListBoxGroup
                key={groupName}
                groupName={groupName}
                groups={groups[groupName]}
                autos={autos}
                onSelectAutomation={onSelectAutomation}
            />
        })
    }
}


const AutomationListBoxGroup: FC<{
    groupName: string,
    groups: any,
    autos: Array<[AutomationData, number]>,
    onSelectAutomation: (i: number) => void,
}> = ({
    groupName,
    groups,
    autos,
    onSelectAutomation,
}) => {
        const [open, setOpen] = useState(false);
        return <div className="automation-list-box--body--group">
            <b onClick={() => setOpen(!open)}>{groupName} {!open ? "⊕" : "⊖"}</b>
            {open && convertGroupsToItems(groups, autos, onSelectAutomation)}
        </div>
    }