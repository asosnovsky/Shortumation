import { useState } from "react";
import { AutomationCondition } from "../../automation/types/condition";
import InputList from "../InputList";



export interface Props {
    condition: AutomationCondition
}
export default function ConditionNode({
    condition
}: Props) {

    return <div className="condition-node">
        {/* <InputList
            current={condition.condition}
            options={}
        /> */}
    </div>
}