import "./AutomationListBox.css";
import { FC, useState } from 'react';
import { AutomationData } from "types/automations";
import InputMultiSelect from "components/Inputs/InputMultiSelect";
import InputText from "components/Inputs/InputText";
import { Button } from "components/Inputs/Button";
import { TrashIcon } from "components/Icons";


export type Props = {
    automations: AutomationData[];
    onSelectAutomation: (i: number) => void;
    onRemove: (i: number) => void;
    onAdd: () => void;
}

export const AutomationListBox: FC<Props> = ({
    automations,
    onSelectAutomation,
    onAdd,
    onRemove,
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
                max={3}
            />
        </div>
        <div className="automation-list-box--body">
            {convertGroupsToItems(groups, filteredAutomations, onSelectAutomation, onRemove)}
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
            if (!a.tags[tags[i]]) {
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
            if (!where[a.tags[tag]]) {
                where[a.tags[tag]] = {}
            }
            lastKey = a.tags[tag]
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
    onRemove: (i: number) => void,
) => {
    if (Array.isArray(groups)) {
        return groups.map(i => {
            const [auto, autoIndex] = autos[i];
            return <div
                key={i}
                className="automation-list-box--body--item"
                title={`Name = ${auto.metadata.alias}\nID = ${auto.metadata.id}\nDescription = ${auto.metadata.description}`}
                onClick={() => onSelectAutomation(autoIndex)}
            >
                <div
                    className="automation-list-box--body--item--title"
                >
                    <b>{auto.metadata.alias.slice(0, 15)} <span>({auto.metadata.id.slice(0, 5)})</span></b>
                    <span>{auto.metadata.description.slice(0, 25)}</span>
                    <div
                        className="automation-list-box--body--item--tags"
                    >
                        {Object.keys(auto.tags).map(tagName => <span key={tagName}>
                            <b>{tagName}:</b> {auto.tags[tagName]}
                        </span>)}
                    </div>
                </div>
                <Button onClick={() => onRemove(autoIndex)}><TrashIcon /></Button>
            </div>
        })
    } else {
        return Object.keys(groups).map(groupName => {
            return <AutomationListBoxGroup
                key={groupName}
                groupName={groupName}
                groups={groups[groupName]}
                autos={autos}
                onSelectAutomation={onSelectAutomation}
                onRemove={onRemove}
            />
        })
    }
}


const AutomationListBoxGroup: FC<{
    groupName: string,
    groups: any,
    autos: Array<[AutomationData, number]>,
    onSelectAutomation: (i: number) => void,
    onRemove: (i: number) => void;
}> = ({
    groupName,
    groups,
    autos,
    onSelectAutomation,
    onRemove,
}) => {
        const [open, setOpen] = useState(false);
        return <div className="automation-list-box--body--group">
            <b onClick={() => setOpen(!open)}>{groupName} {!open ? "⊕" : "⊖"}</b>
            {open && convertGroupsToItems(groups, autos, onSelectAutomation, onRemove)}
        </div>
    }