import { FC } from "react";
import { Handle, Position } from "react-flow-renderer";
import { SequenceNodeProps } from "./types";
import { SequenceNodeElement } from "./SequenceNodeElement";

export const SequenceNode: FC<SequenceNodeProps> = (props) => {
  return (
    <SequenceNodeElement {...props}>
      <>
        <Handle
          id="default"
          key="target-default"
          type="target"
          position={props.flipped ? Position.Top : Position.Left}
        />

        <Handle
          id="return"
          key="target-return"
          type="target"
          position={props.flipped ? Position.Right : Position.Bottom}
        />
      </>
      <Handle
        type="source"
        position={props.flipped ? Position.Bottom : Position.Right}
      />
      <Handle
        id="side"
        type="source"
        position={props.flipped ? Position.Right : Position.Bottom}
      />
    </SequenceNodeElement>
  );
};
