import "./ButtonNode.css";

import { ButtonIcon } from "components/Icons/ButtonIcons";
import { FC } from "react";
import { ButtonNodeProps } from "./types";
import { Handle, Position } from "react-flow-renderer";
import { Button } from "components/Inputs/Buttons/Button";

export const ButtonNode: FC<ButtonNodeProps> = ({
  height,
  width,
  icon,
  flipped,
  onClick,
  text,
}) => {
  const inner = (
    <>
      <Handle
        id="default"
        type="target"
        position={flipped ? Position.Top : Position.Left}
      />
      {icon}
      <Handle
        id="default"
        type="source"
        position={!flipped ? Position.Bottom : Position.Right}
      />
      <Handle
        id="next"
        type="source"
        position={!flipped ? Position.Right : Position.Bottom}
      />
    </>
  );
  return (
    <div
      className="button-node"
      style={
        {
          "--button-height": `${height}px`,
          "--button-width": `${width}px`,
        } as any
      }
    >
      {!text ? (
        <ButtonIcon icon={inner} onClick={onClick} />
      ) : (
        <Button onClick={onClick}>
          {inner}
          {text}
        </Button>
      )}
    </div>
  );
};
