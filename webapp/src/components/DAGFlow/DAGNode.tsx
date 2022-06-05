import { PencilIcon } from "components/Icons"
import { NodeColor } from "types/graphs";
import { useNodeStyles } from "./styles";
import { Handle, Position } from 'react-flow-renderer';
import { FC } from "react";


export interface DAGNodeProps {
  height: number;
  width: number;
  onXClick?: () => void;
  onEditClick?: () => void;
  color: NodeColor;
  label: string;
  hasInput?: boolean;
  accentBackground?: boolean;
  flipped: boolean;
}
export const DAGNode: FC<DAGNodeProps> = ({
  label,
  height,
  width,
  onXClick,
  onEditClick = () => { },
  color,
  hasInput = false,
  accentBackground = false,
  flipped,
}) => {
  const { classes, theme } = useNodeStyles({
    color,
    nodeHeight: height,
    nodeWidth: width,
    accentBackground,
  });
  return <>
    {hasInput && <Handle type="target" position={flipped ? Position.Top : Position.Left} />}
    <Handle type="source" position={flipped ? Position.Bottom : Position.Right} />
    <div className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.leftEdge} onClick={onXClick}>
          {!!onXClick && <button className={classes.buttonDelete}>X</button>}
        </div>
        <div className={classes.textWrap}>
          <span className={classes.text} title={label}>
            {label}
          </span>
        </div>
        <div className={classes.rightEdge} onClick={onEditClick}>
          <button className={classes.buttonEdit}>
            <PencilIcon size={1.1} color={theme.green} />
          </button>
        </div>
      </div>
    </div>
  </>
}
