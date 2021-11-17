import { FC } from "react";
import { AutomationAction } from "~/automations/types/actions";


export const SequenceEditor: FC<{
    node: AutomationAction,
    onUpdate: (u: AutomationAction) => void,
}> = ({
    node,
    onUpdate,
}) => {

    return <div>
        <div>
            <span>{node.action}</span>
        </div>
    </div>
}