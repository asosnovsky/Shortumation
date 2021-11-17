import { FC } from "react";
import { ChooseAction } from "~/automations/types/actions";


export const ChooseEditor: FC<{
    node: ChooseAction,
    onUpdate: (u: ChooseAction) => void,
}> = ({
    node,
    onUpdate,
}) => {

    return <div>
        <div>
            <span>{node.action}</span>
        </div>
        <div>
            <div>
                {node.action_data.choose.map( ({conditions, sequence}, i) => <div>
                    <button>X</button>
                    <div>{i > 0 ? "else if" : 'if'}</div>
                    <div>Condition</div>
                    <div>
                        {sequence.map( s => s.$smType)}
                    </div>
                </div>)}
            </div>
        </div>
    </div>
}