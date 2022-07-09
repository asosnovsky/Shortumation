import Add from "@mui/icons-material/Add";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { FC } from "react";
import { SequenceNodeElement } from "../SequenceNode/SequenceNodeElement";
import { TriggerNodeProps } from "./types";

export const TriggerNodes: FC<TriggerNodeProps> = ({
  onAddNode,
  nodes,
  sequenceNode,
  height,
  width,
  flipped,
}) => {
  return (
    <div
      className="trigger-nodes"
      style={{
        maxHeight: height,
        maxWidth: width,
      }}
    >
      {nodes.map((n, i) => (
        <SequenceNodeElement
          {...n}
          {...sequenceNode}
          key={i}
          color="red"
          flipped={flipped}
        />
      ))}
      <ButtonIcon icon={<Add />} onClick={onAddNode} />
    </div>
  );
};
