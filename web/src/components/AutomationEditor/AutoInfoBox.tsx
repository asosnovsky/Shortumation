import { AutomationMetadata } from "~/automations/types";
import InputList from "../Inputs/InputList";
import InputText from "../Inputs/InputText";
import InputTextArea from "../Inputs/InputTextArea";

interface Props {
    className: string;
    metadata: AutomationMetadata;
    onUpdate: (m: AutomationMetadata) => void;
}
export default function AutoInfoBox({
    metadata,
    onUpdate,
    className,
}: Props) {

       // aliases
    const onUpdateMetadata = <K extends keyof AutomationMetadata>(k: K) =>(update: AutomationMetadata[K]) => onUpdate({
            ...metadata,
            [k]: update
    })

    // render
    return <div className={className}>
        <InputText label="ID" value={metadata.id} onChange={onUpdateMetadata('id')} />
        <InputText label="Name" value={metadata.alias} onChange={onUpdateMetadata('alias')} />
        <InputTextArea label="Description" value={metadata.description} onChange={onUpdateMetadata('description')} />
        <InputList
            label="Mode"
            current={metadata.mode}
            onChange={onUpdateMetadata('mode')}
            options={[
                'parallel',
                'single',
                'queued',
                'restart'
            ]}
        />
    </div>
}