import "./InputEntities.css";
import { FC } from "react";
import { useHAEntities } from 'haService';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { prettyName } from "utils/formatting";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { EntityId } from 'types/automations/common';
import { Badge } from "@mui/material";

export type InputEntityProps = {
    restrictToDomain?: string[],
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

export const InputEntity: FC<InputEntityProps> = props => {
    // state
    const entities = useHAEntities();

    // processing of inputs
    const options = entities.getOptions(props.restrictToDomain);
    const value = Array.isArray(props.value) ? props.value : !!props.value ? [props.value] : [];
    const errors = entities.validateOptions(value, props.restrictToDomain);

    // processing of errors
    let helperText = <></>;
    let error: boolean = false;
    if (errors !== null) {
        error = true
        if (errors.length > 0) {
            helperText = <Badge
                className="input-entities--errors"
                badgeContent={errors.length} color="error"
            >
                <ul title={errors.join(', and')}>{errors.map((msg, i) => <li key={i}>
                    {msg}
                </li>)}</ul>
            </Badge>
        }
    }
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
        getOptionLabel={entities.getLabel}
        filterOptions={(opts, s) => {
            const searchTerm = s.inputValue.toLocaleLowerCase();
            return opts.map(opt => {
                let similarityScore = 0;
                const eid = entities.getID(opt);
                if (eid.toLocaleLowerCase().includes(searchTerm)) {
                    similarityScore = Math.abs(eid.length - searchTerm.length)
                }
                const name = entities.getLabel(opt);
                if (name.toLocaleLowerCase().includes(searchTerm)) {
                    similarityScore = Math.abs(eid.length - searchTerm.length)
                }
                return {
                    label: name,
                    id: eid,
                    domain: (typeof opt === 'string') ? '' : opt.domain,
                    similarityScore
                }
            }).filter(opt => opt.similarityScore > 0).sort((a, b) => {
                return (a.similarityScore > b.similarityScore) ? 1 : -1
            })
        }}
        groupBy={opt => (typeof opt !== 'string') ? prettyName(opt.domain) : ''}
        renderOption={(prop, option, { inputValue }) => {
            const label = entities.getLabel(option);
            const id = entities.getID(option);

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
            label={props.label ?? "Entity ID"}
            helperText={helperText}
            error={error}
        />}
        renderTags={(tagValue, getTagProps) => <Badge badgeContent={tagValue.length} color="info">
            <div className="input-entities--tags">
                {tagValue.map((option, index) => {
                    const label = entities.getLabel(option);
                    const id = entities.getID(option);
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


export const HighlightElm: FC<{
    text: string,
    searchTerm: string
}> = ({
    text,
    searchTerm
}) => {
        const matches = match(text, searchTerm, {
            "findAllOccurrences": true,
            "insideWords": true
        });
        const parts = parse(text, matches);
        return <>
            {parts.map((part, index) => (
                <span
                    key={index}
                    style={{
                        textDecoration: part.highlight ? 'underline' : 'unset'
                    }}
                >
                    {part.text}
                </span>
            ))}
        </>
    }

export const SearchItem: FC<{
    listProps: React.HTMLAttributes<HTMLLIElement>,
    label: string,
    id: string,
    searchTerm: string,
}> = ({
    listProps,
    label,
    id,
    searchTerm
}) => <li {...listProps} className={[listProps.className ?? "", 'input-entities--list'].join(' ')}>
            <b><HighlightElm text={label} searchTerm={searchTerm} /></b> <small>
                <HighlightElm text={id} searchTerm={searchTerm} />
            </small>
        </li>