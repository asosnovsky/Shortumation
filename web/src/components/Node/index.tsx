import { PropsWithChildren, useState } from "react";

export interface Props {
    title: string;
    showX?: boolean;
    showChildren?: boolean;
    initialOpenState?: boolean;
    onXClick?: () => void;
}
export default function AutomationNode({
    children,
    title,
    showX=false,
    showChildren=false,
    initialOpenState=false,
    onXClick = () => {},
}: PropsWithChildren<Props>) {
    const [isOpen, setOpen] = useState(initialOpenState);
    console.log(children);
    return <div className="automation-node">
    <div className="automation-node-inner">
      <div
        className="automation-node-inner-edge left"
        onClick={() => onXClick()}
      >
        {showX && (
          <div className="automation-node-side-button">X</div>
        )}
      </div>
      <div className="automation-node-inner-text">{title}</div>
      <div
        className="automation-node-inner-edge right"
        onClick={() => setOpen(!isOpen)}
      >
        {showChildren && <div className="automation-node-side-button">{isOpen ? "▲" : "▼"}</div>}
      </div>
    </div>
    {showChildren&&<div className={`automation-node-children ${isOpen ? "open" : "closed"}`}>
      {children}
    </div>}
  </div>
}