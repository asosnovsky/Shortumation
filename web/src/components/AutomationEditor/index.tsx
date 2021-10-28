import { useState } from "react";
import * as types from "../../automation/types";
import { getNameFromAction } from "../../automation/utils";
import AutomationNode from "../Node";
import NewNodeModal from "./NewNodeModal";

export interface Props {
    automation: types.Automation;
}
export default function AutomationEditor({ automation }: Props) {
    // state
    const [modalState, setModalState] = useState<types.AutomationNodeType | null>(null);
    const [state, setState] = useState(automation);

    // helper state functions
    const addNode = <T extends types.AutomationNodeType>(node_type: T, node: types.AutomationNodeTypes[T]) => {
      const nodes: types.AutomationNode[] = state[node_type];
      setState({
        ...state,
        [node_type]: nodes.concat([node as any])
      });
    }
    const removeNode = <T extends types.AutomationNodeType>(node_type: T, node_id: number) => {
      const nodes: types.AutomationNode[] = state[node_type];
      setState({
        ...state,
        [node_type]: nodes
        .slice(0, node_id)
        .concat(
        nodes.slice(
            node_id + 1,
            nodes.length
        )
        )
      });
    }
    // helper element functions
    const makeChild = (node_type: types.AutomationNodeType) => {
      const nodes: types.AutomationNode[] = state[node_type];
      return [
        <div className="automation-box--elm-list" key="list">
          {state[node_type].map((n, i) => (
            <AutomationNode
              key={i}
              title={getNameFromAction(n)}
              showX={false}
              initialOpenState={false}
              onXClick={() => removeNode(node_type, i)}
            />
          ))}
        </div>,
        <button
          key="btn"
          className="elm-list"
          onClick={() => setModalState(node_type)}
        >
          Add +
        </button>
      ];
    }

    return <div className="automation-editor">
        <AutomationNode 
            title={`${automation.alias} (${automation.mode})`}
            initialOpenState={true}
            showChildren={true}
            showX={false}
        >
            <div className="automation-editor--root">
                <h4>Trigger</h4>
                {makeChild("trigger")}
                <h4>Condition</h4>
                {makeChild("condition")}
                <h4>Actions</h4>
                {makeChild("action")}
            </div>
        </AutomationNode>
        {modalState && <NewNodeModal
          node_type={modalState}
          onClose={() => setModalState(null)}
          onCreate={node => {
            addNode(modalState, node);
            setModalState(null);
          }}
        />}
  </div>
}