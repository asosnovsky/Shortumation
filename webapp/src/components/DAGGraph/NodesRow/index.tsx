import "./index.css";

//*   <div className="nodes-row--inner row">
//     {data.map((node, i) => {
//       return (
//         <SequenceNodeElement
//           key={i}
//           {...makeCollectionNodeMakerChildProps(
//             collectionType,
//             node,
//             i,
//             stateUpdater,
//             namer
//           )}
//         />
//       );
//     })}
//   </div>*/

import { AutomationNode, AutomationNodeMapping } from "types/automations";
import { useHA } from "services/ha";
import { CollectionNodeElement } from "components/DAGGraph/nodes/CollectionNode/CollectionNodeElement";
import { Size } from "components/DAGGraph/elements/types";
import { DAGGraphUpdater } from "components/DAGGraph/updater";
import { makeCollectionNodeMakerChildProps } from "components/DAGGraph/elements/helpers";
import { AutomationCondition } from "types/automations/conditions";
import { AutomationTrigger } from "types/automations/triggers";
import { FC } from "react";
import { SequenceNodeElement } from "components/DAGGraph/nodes/SequenceNode/SequenceNodeElement";

export type NodesRowProps<
  K extends keyof AutomationNodeMapping,
  T extends AutomationNode<K>
> = {
  type: K;
  data: T[];
  stateUpdater: DAGGraphUpdater;
  sequenceNodeDims: Size;
};

export function NodesRow<
  K extends keyof AutomationNodeMapping,
  T extends AutomationNode<K>
>({
  type: collectionType,
  data,
  sequenceNodeDims,
  stateUpdater,
}: NodesRowProps<K, T>) {
  const { namer } = useHA();
  return (
    <div className="nodes-row--outer center row">
      <CollectionNodeElement
        className="nodes-row--inner"
        width={0}
        height={0}
        nodes={data.map((node, i) =>
          makeCollectionNodeMakerChildProps(
            collectionType,
            node,
            i,
            stateUpdater,
            namer
          )
        )}
        onAddNode={() => stateUpdater.basic[collectionType].addNode(null)}
        collectionType={collectionType}
        sequenceNode={sequenceNodeDims}
        flipped
      />
    </div>
  );
}

export type TriggerConditionNodeRowProps = {
  condition: AutomationCondition[];
  trigger: AutomationTrigger[];
  stateUpdater: DAGGraphUpdater;
  sequenceNodeDims: Size;
};
export const TriggerConditionNodeRow: FC<TriggerConditionNodeRowProps> = ({
  condition,
  trigger,
  stateUpdater,
  sequenceNodeDims,
}) => {
  return (
    <div className={["trigger-condition-nodes-row column"].join(" ")}>
      <NodesRow
        data={trigger}
        type="trigger"
        stateUpdater={stateUpdater}
        sequenceNodeDims={sequenceNodeDims}
      />
      <NodesRow
        data={condition}
        type="condition"
        stateUpdater={stateUpdater}
        sequenceNodeDims={sequenceNodeDims}
      />
    </div>
  );
};
