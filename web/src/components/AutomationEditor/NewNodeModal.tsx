import { useState, useEffect } from "react";
import StateManager from "../../automation/StateManager";
import { AutomationNodeType, AutomationNodeTypes, NodeSubType, typeList } from "../../automation/types";
import InputList from "../InputList";

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
    const [selectedSubType, setSubType] = useState<NodeSubType>(typeList[node_type][0]);
    const stateManager = new StateManager(node_type, selectedSubType);

    useEffect(() => {
        if (stateManager.nodeType !== node_type || stateManager.nodeSubtype !== selectedSubType) {
            stateManager.swapBaseState(node_type, selectedSubType)
        }
    }, [node_type, selectedSubType]);

    return <div className="new-node-modal">
        <div className="new-node-modal--background" onClick={() => onClose()}></div>
        <div className="new-node-modal--inner" onClick={e => e.preventDefault()}>
            <div className="new-node-modal--title">Create {node_type[0].toUpperCase()}{node_type.slice(1)}</div>
            <div className="new-node-modal--body">
                <InputList label="Type:" 
                    options={typeList[node_type]} 
                    current={selectedSubType} 
                    onChange={n => setSubType(n as NodeSubType)}
                />
                {stateManager.renderOptionList()}
            </div>
            <div className="new-node-modal--footer">
                <button onClick={() => onClose()}>Close</button>
                <button onClick={() => onCreate(stateManager.state)}
                        disabled={!stateManager.isReady}>
                    Create
                </button>
            </div>
        </div>
    </div>
}