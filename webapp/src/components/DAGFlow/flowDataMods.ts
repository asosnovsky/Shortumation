import { DAGCircleProps, makeFlowCircle } from "./DAGCircle"
import { DAGAutomationFlowDims } from "./types"
import { Node, XYPosition } from 'react-flow-renderer';
import { DAGNodeProps } from "./DAGNode";

export const makeAddButton = (
    id: string,
    position: XYPosition,
    {
        circleSize,
        flipped,
    }: DAGAutomationFlowDims,
    onAdd: () => void,
    disableTarget: boolean = true,
): Node<DAGCircleProps> => makeFlowCircle(
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
        conditionWidth,
        conditionHeight,
        flipped,
    }: DAGAutomationFlowDims,
    totalConditions: number,
    onEditClick: () => void,
): Node<DAGNodeProps> => ({
    id,
    type: 'dagnode',
    position,
    data: {
        color: 'lblue',
        accentBackground: true,
        label: `${totalConditions} Condition${totalConditions !== 1 ? 's' : ''}`,
        height: conditionHeight,
        width: conditionWidth,
        hasInput: true,
        onEditClick,
        flipped,
    }
})