import "./AutomationListBox.css";
import { FC, useState } from 'react';
import { AutomationData } from "types/automations";
import InputMultiSelect from "components/Inputs/InputMultiSelect";
import InputText from "components/Inputs/InputText";


export type Props = {
    automations: AutomationData[];
}

export const AutomationListBox: FC<Props> = ({
    automations
}) => {

    const tags = getTagList(automations);
    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const filteredAutomations = filterAutomations(automations, searchText, selected, tags);


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

        </div>
    </div>
}


const getTagList = (autos: AutomationData[]): string[] => autos
    .map(a => Object.keys(a.metadata.tags))
    .reduce((all, keys) => all.concat(keys))

const filterAutomations = (autos: AutomationData[], searchText: string, selected: number[], tags: string[]) => autos.filter(a => {
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

export type GroupedAutos = Record<string, GroupedAutos | string[]>;
export const groupAutomations = (autos: AutomationData[], selected: number[], tags: string[]) => {
    const out: GroupedAutos = {};
    for (const a of autos) {
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
        if (tag) {
            if (!where[a.metadata.tags[tag]]) {
                where[a.metadata.tags[tag]] = []
            }
            where[a.metadata.tags[tag]].push(a.metadata.id)
        }
    }
    return out;
}