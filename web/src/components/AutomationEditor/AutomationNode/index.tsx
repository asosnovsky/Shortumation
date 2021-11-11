import { PropsWithChildren, useState } from "react";

export interface Props {
    title: string;
    initialOpenState?: boolean;
    onXClick?: () => void;
}
export default function AutomationNode({
    children,
    title,
    initialOpenState=false,
    onXClick = () => {},
}: PropsWithChildren<Props>) {
    const [isOpen, setOpen] = useState(initialOpenState);
    return <div className="automation-node">
    <div className="automation-node-inner">
      <div
        className="automation-node-inner-edge left"
        onClick={() => onXClick()}
      >
        <div className="automation-node-side-button">X</div>
      </div>
      <div className="automation-node-inner-text">{title}</div>
      <div
        className="automation-node-inner-edge right"
        onClick={() => setOpen(!isOpen)}
      >
        <div className="automation-node-side-button">{isOpen ? "▲" : "▼"}</div>
      </div>
    </div>
    <div className={`automation-node-children ${isOpen ? "open" : "closed"}`}>
      {children}
    </div>
  </div>
}