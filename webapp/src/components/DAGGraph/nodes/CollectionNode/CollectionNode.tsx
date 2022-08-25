import { FC } from "react";
import { CollectionNodeProps } from "./types";
import { Handle, Position } from "react-flow-renderer";
import { CollectionNodeElement } from "./CollectionNodeElement";

export const CollectionNode: FC<CollectionNodeProps> = (props) => {
  return (
    <CollectionNodeElement {...props}>
      <>
        <Handle
          id="default"
          key="source-def"
          type="source"
          position={props.flipped ? Position.Bottom : Position.Right}
        />
        <Handle
          id="head"
          key="source-head"
          type="source"
          position={props.flipped ? Position.Top : Position.Left}
        />
      </>
      <>
        <Handle
          id="default"
          key="target-def"
          type="target"
          position={props.flipped ? Position.Top : Position.Left}
        />
        <Handle
          id="side"
          key="target-side"
          type="target"
          position={!props.flipped ? Position.Right : Position.Left}
        />
        <Handle
          id="return"
          key="target-return"
          type="target"
          position={!props.flipped ? Position.Bottom : Position.Right}
        />
      </>
    </CollectionNodeElement>
  );
};
