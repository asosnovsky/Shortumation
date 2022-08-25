import "./index.css";

import { AutomationNode, AutomationNodeMapping } from "types/automations";
import { useHA } from "haService";
import { CollectionNodeElement } from "components/DAGGraph/nodes/CollectionNode/CollectionNodeElement";
import { getDescriptionFromAutomationNode } from "utils/formatting";
import { Size } from "components/DAGGraph/elements/types";

export type NodesRowProps<
  K extends keyof AutomationNodeMapping,
  T extends AutomationNode<K>
> = {
  type: K;
  data: T[];
  onUpdate: (d: T[]) => void;
  sequenceNodeDims: Size;
};

export function NodesRow<
  K extends keyof AutomationNodeMapping,
  T extends AutomationNode<K>
>({ type: collectionType, data, sequenceNodeDims }: NodesRowProps<K, T>) {
  const { namer } = useHA();
  return (
    <div className="automation-editor--nodes-row">
      <CollectionNodeElement
        width={0}
        height={0}
        nodes={data.map((node) => ({
          enabled: node.enabled ?? true,
          label: getDescriptionFromAutomationNode(node, namer, true),
          onXClick: () => {},
        }))}
        onAddNode={() => {}}
        collectionType={collectionType}
        title="if"
        sequenceNode={sequenceNodeDims}
        flipped
      />
    </div>
  );
}
