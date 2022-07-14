import { FC } from "react";
import { Handle, Position } from "react-flow-renderer";
import { SequenceNodeProps } from "./types";
import { SequenceNodeElement } from "./SequenceNodeElement";

export const SequenceNode: FC<SequenceNodeProps> = ({
  hasInput = false,
  ...props
}) => {
  return (
    <SequenceNodeElement {...props}>
      {hasInput && (
        <>
          <Handle
            type="target"
            position={props.flipped ? Position.Top : Position.Left}
          />
        </>
      )}
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
