import { makeFlowCircle } from "./DAGCircle"
import { DAGAutomationFlowDims } from "./types"
import { XYPosition } from 'react-flow-renderer';

export const makeAddButton = (
    id: string,
    position: XYPosition,
    {
        circleSize,
        flipped,
    }: DAGAutomationFlowDims,
    onAdd: () => void,
    disableTarget: boolean = true,
) => makeFlowCircle(
    id,
    position,
    {
        flipped,
        size: circleSize,
        onAdd,
        disableSource: true,
        disableTarget,
    }
)

export const makeConditionPoint = (
    id: string,
    position: XYPosition,
    {
        padding,
        conditionWidth,
        conditionHeight,
        nodeWidth,
        nodeHeight,
        circleSize,
        distanceFactor,
    }: DAGAutomationFlowDims,
    totalConditions: number,
    onEditClick: () => void,
) => ({
    id,
    type: 'dagnode',
    position,
    data: {
        size: circleSize,
        color: 'lblue',
        accentBackground: true,
        label: `${totalConditions} Condition${totalConditions !== 1 ? 's' : ''}`,
        height: conditionHeight,
        width: conditionWidth,
        hasInput: true,
        onEditClick,
    }
})