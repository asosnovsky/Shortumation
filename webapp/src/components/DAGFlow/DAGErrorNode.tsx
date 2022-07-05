import "./DAGErrorNode.css";
import { Handle, Position } from "react-flow-renderer";
import { FC } from "react";
import { InfoIcon, PencilIcon } from "components/Icons";

export interface DAGErrorNodeProps {
  height: number;
  width: number;
  flipped: boolean;
  hasInput?: boolean;
  error?: any;
  onEdit: () => void;
}
export const DAGErrorNode: FC<DAGErrorNodeProps> = ({
  height,
  width,
  hasInput,
  error,
  onEdit,
  flipped,
}) => {
  // render
  return (
    <>
      {hasInput && (
        <Handle
          type="target"
          position={flipped ? Position.Top : Position.Left}
        />
      )}
      <Handle
        type="source"
        position={flipped ? Position.Bottom : Position.Right}
      />
      <div
        className={["dagnode-error"].join(" ")}
        style={{
          height,
          width,
          maxHeight: height,
          maxWidth: width,
        }}
      >
        <div className={"dagnode-error--inner"} title={String(error)}>
          <InfoIcon color="var(--mui-error-light)" size={1.25} />
          Invalid Node
          <PencilIcon
            className="dagnode-error--inner--edit-icon"
            size={1.25}
            onClick={onEdit}
          />
        </div>
      </div>
    </>
  );
};
