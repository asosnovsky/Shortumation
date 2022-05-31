import "./InputEntities.css";
import { FC } from "react";
import { useHADeviceRegistry } from 'haService';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { EntityId } from 'types/automations/common';
import { Badge } from "@mui/material";
import { SearchItem } from "./extras";
import { prettyName } from 'utils/formatting';

export type InputEntityProps = {
    label?: string,
} & ({
    value: string | null;
    multiple?: false;
    onChange: (v: string | null) => void;
} | {
    value: EntityId;
    multiple: true;
    onChange: (v: string[]) => void;
})

export const InputDevice: FC<InputEntityProps> = props => {
    // state
    const dr = useHADeviceRegistry();

    // processing of inputs
    const options = dr.getOptions();
    const value = Array.isArray(props.value) ? props.value : !!props.value ? [props.value] : [];

    // events
    const onChange = (_e: any, v: any) => {
        const cleanValue: string[] = v === null ? [] :
            Array.isArray(v) ? v.map(opt => {
                if (typeof opt === 'string') {
                    return opt
                }
                return opt.id
            }) : [v];
        if (props.multiple) {
            props.onChange(cleanValue);
        } else {
            props.onChange(cleanValue[cleanValue.length - 1])
        }
    }

    return <Autocomplete
        className="input-entities"
        multiple={true}
        freeSolo
        value={value}
        options={options}
        onChange={onChange}
        getOptionLabel={dr.getLabel}
        groupBy={opt => (typeof opt !== 'string') ? prettyName(opt.manufacturer) : ''}
        filterOptions={(opts, s) => {
            const searchTerm = s.inputValue.toLocaleLowerCase();
            return opts.map(opt => {
                let similarityScore = 0;
                const eid = dr.getID(opt);
                if (eid.toLocaleLowerCase().includes(searchTerm)) {
                    similarityScore = Math.abs(eid.length - searchTerm.length)
                }
                const name = dr.getLabel(opt);
                if (name.toLocaleLowerCase().includes(searchTerm)) {
                    similarityScore = Math.abs(eid.length - searchTerm.length)
                }
                return {
                    label: name,
                    id: eid,
                    similarityScore,
                    manufacturer: (typeof opt === 'string') ? '' : opt.manufacturer ?? ""
                }
            }).filter(opt => opt.similarityScore > 0).sort((a, b) => {
                return (a.similarityScore > b.similarityScore) ? 1 : -1
            })
        }}
        renderOption={(prop, option, { inputValue }) => {
            const label = dr.getLabel(option);
            const id = dr.getID(option);

            return <SearchItem
                listProps={prop}
                id={id}
                label={label}
                searchTerm={inputValue}
            />
        }}
        renderInput={params => <TextField
            {...params}
            variant="filled"
            label={props.label ?? "Device"}
        />}
        renderTags={(tagValue, getTagProps) => <Badge badgeContent={tagValue.length} color="info">
            <div className="input-entities--tags">
                {tagValue.map((option, index) => {
                    const label = dr.getLabel(option);
                    const id = dr.getID(option);
                    const props = getTagProps({ index });
                    props.className += ' input-entities--chip'
                    return (
                        <Chip
                            size="medium"
                            label={<>
                                {(id === label) ? <span>{label}</span> : <b>{label}</b>}
                                {(id !== label) && <small>{id}</small>}
                            </>}
                            {...props}
                        />
                    )
                })}
            </div>
        </Badge>
        }
    />
}
