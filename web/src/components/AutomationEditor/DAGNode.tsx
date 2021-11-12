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
                <div className="automation-node-side-button">X</div>
            </div>
            <div className="automation-editor--node-inner-text">{text}</div>
            <div className="automation-editor--node-inner-edge right" onClick={onOpenClick}>
                <div className="automation-node-side-button">{isOpen ? "▲" : "▼"}</div>
            </div>
        </div>
    </div>
</foreignObject>