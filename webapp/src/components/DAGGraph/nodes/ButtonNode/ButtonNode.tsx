import "./ButtonNode.css";

import { ButtonIcon } from "components/Icons/ButtonIcons";
import { FC } from "react";
import { ButtonNodeProps } from "./types";
import { Handle, Position } from "react-flow-renderer";

export const ButtonNode: FC<ButtonNodeProps> = ({
  height,
  width,
  icon,
  flipped,
  onClick,
}) => {
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
      <ButtonIcon
        icon={
          <>
            <Handle
              type="target"
              position={flipped ? Position.Top : Position.Left}
            />
            {icon}
            <Handle
              type="source"
              position={!flipped ? Position.Bottom : Position.Right}
            />
          </>
        }
        onClick={onClick}
      />
    </div>
  );
};
