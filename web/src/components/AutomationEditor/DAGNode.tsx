import { FC } from "react"
import { NODE_HEIGHT, NODE_WIDTH } from "./constants"
import { Node } from "./types"



export interface NodeProp extends Node {
    height?: number;
    width?: number;
    isOpen?: boolean;
    onXClick?: () => void;
    onOpenClick?: () => void;
}
export default ({
    loc: [x,y],
    text,
    height=NODE_HEIGHT,
    width=NODE_WIDTH,
    onXClick=() => {},
    onOpenClick=() => {},
    isOpen=false,
    color,
}: NodeProp) => <foreignObject x={x} y={y} width={width} height={height}>
    <div className="automation-editor--node">
        <div className={`automation-editor--node-inner top-color ${color}`}>
            <div className="automation-editor--node-inner-edge left" onClick={onXClick}>
                <span className="automation-node-side-button">X</span>
            </div>
            <div className="automation-editor--node-inner-text">
                <span>{text}</span>
            </div>
            <div className="automation-editor--node-inner-edge right" onClick={onOpenClick}>
                <span className="automation-node-side-button">{isOpen ? "▲" : "▼"}</span>
            </div>
        </div>
    </div>
</foreignObject>

export interface ConditionNodeProps extends NodeProp {
    conditionType: string;
}
export const ConditionNode: FC<ConditionNodeProps> = ({
    loc: [x,y],
    text,
    height=NODE_HEIGHT,
    width=NODE_WIDTH,
    onXClick=() => {},
    onOpenClick=() => {},
    isOpen=false,
    color,
    conditionType,
    children,
}) => <foreignObject x={x} y={y} width={width} height={height}>
    <div className="automation-editor--condition-node">
        <div className="automation-editor--condition-node-type">
            {conditionType}
        </div>
        <div>
            {children}
        </div>
    </div>
</foreignObject>