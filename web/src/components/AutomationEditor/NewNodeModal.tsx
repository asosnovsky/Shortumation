import { useState } from "react";
import { AutomationNodeType, AutomationNodeTypes } from "../../automation/types";
import { typeList } from "../../automation/useNodeState";
import InputList from "../InputList";
import InputWrapper from "../InputWrapper";

export interface Props<T extends AutomationNodeType> {
    node_type: T,
    onClose: () => void,
    onCreate: (newnode: AutomationNodeTypes[T]) => void,
}
export default function NewNodeModal<T extends AutomationNodeType>({
    node_type,
    onClose,
    onCreate,
}: Props<T>) {
    const [selectedSubType, setSubType] = useState<string>(typeList[node_type][0]);

    return <div className="new-node-modal">
        <div className="new-node-modal--background" onClick={() => onClose()}></div>
        <div className="new-node-modal--inner" onClick={e => e.preventDefault()}>
            <div className="new-node-modal--title">Create {node_type[0].toUpperCase()}{node_type.slice(1)}</div>
            <div className="new-node-modal--body">
                <InputWrapper label="Type:">
                    <InputList options={typeList[node_type]} current={selectedSubType} onChange={n => setSubType(n)}/>
                </InputWrapper>
            </div>
            <div className="new-node-modal--footer">
                <button className="secondary" onClick={() => onClose()}>Close</button>
                <button onClick={() => onCreate({} as any)}>Create</button>
            </div>
        </div>
    </div>
}