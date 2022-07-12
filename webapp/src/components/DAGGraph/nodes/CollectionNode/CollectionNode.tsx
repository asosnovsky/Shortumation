import "./CollectionNode.css";

import Add from "@mui/icons-material/Add";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { FC } from "react";
import { SequenceNodeElement } from "../SequenceNode/SequenceNodeElement";
import { CollectionNodeProps } from "./types";
import { Handle, Position } from "react-flow-renderer";
import { useSequenceNodeColor } from "../SequenceNode/util";
import { prettyName } from "utils/formatting";

export const CollectionNode: FC<CollectionNodeProps> = ({
  onAddNode,
  nodes,
  sequenceNode,
  height,
  width,
  flipped,
  color,
  hasInput = false,
  collectionType,
}) => {
  const nodeColor = useSequenceNodeColor(color);

  return (
    <div
      className="collection-nodes--wrap"
      style={
        {
          "--node-color": nodeColor,
          "--node-height": `${height}px`,
          "--node-width": `${width}px`,
        } as any
      }
    >
      <div className="collection-nodes">
        <span className="collection-nodes--title">
          {prettyName(collectionType)}s
        </span>
        <div className="collection-nodes--inner">
          {nodes.map((n, i) => (
            <SequenceNodeElement
              {...n}
              {...sequenceNode}
              key={i}
              color={color}
              flipped={flipped}
            />
          ))}
        </div>
        <ButtonIcon className="add" icon={<Add />} onClick={onAddNode} />
        <Handle
          key="source"
          type="source"
          position={flipped ? Position.Bottom : Position.Right}
        />
        {hasInput && (
          <Handle
            key="target"
            type="target"
            position={flipped ? Position.Top : Position.Left}
          />
        )}
        <span className="collection-nodes--total">
          {nodes.length} node{nodes.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};
