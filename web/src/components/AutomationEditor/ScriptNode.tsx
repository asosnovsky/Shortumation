import StateManager from "../../automation/StateManager";
import { AutomationAction } from "../../automation/types";
import { determineNodeTypes, getDescriptionFromAutomationNode } from "../../automation/utils";
import AutomationNode from "./AutomationNode";


export interface Props {
    data: AutomationAction;
    onDelete: () => void;
}
export default function ScriptNode({
    data,
    onDelete,
}: Props) {
    const [nodeType, nodeSubType] = determineNodeTypes(data);
    const stateManager = new StateManager(nodeType, nodeSubType, data);

    return <AutomationNode title={getDescriptionFromAutomationNode(data)} onXClick={onDelete}>
        {stateManager.renderOptionList()}
    </AutomationNode>
}