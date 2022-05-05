import { FC } from "react";
import { AddIcon, PencilIcon, TrashIcon } from '../Icons/index';
import { useCircleStyles } from './styles';
import { Handle, Position, XYPosition } from 'react-flow-renderer';



export interface DAGCircleProps {
  onEdit?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
  size: number,
  backgroundColor?: string;
  disableSource?: boolean;
  disableTarget?: boolean;
}
export const makeFlowCircle = (
  circleId: string,
  position: XYPosition,
  data: DAGCircleProps,
) => ({
  id: circleId,
  type: 'dagcircle',
  position,
  data
})

export const DAGCircle: FC<{ data: DAGCircleProps }> = ({
  data: {
    size,
    onEdit,
    onAdd,
    onRemove,
    backgroundColor,
    disableSource = false,
    disableTarget = false,
  }
}) => {
  const { classes } = useCircleStyles({
    size,
    hasOnFunction: !!onEdit || !!onAdd,
    hasRemoveFunction: !!onRemove,
    backgroundColor,
  });
  return <>
    {!disableSource && <Handle type="source" position={Position.Right} />}
    {!disableTarget && <Handle type="target" position={Position.Left} />}
    <div className={classes.root}>
      {
        onEdit ?
          <PencilIcon
            size={70} units="%"
            className={classes.icon}
            onClick={onEdit}
          /> : onAdd ?
            <AddIcon
              size={70} units="%"
              className={classes.icon}
              onClick={onAdd}
            />
            : backgroundColor ? "" : "else"
      }
      {onRemove ? <TrashIcon className={classes.trashIcon} onClick={onRemove} /> : <></>}
    </div>
  </>
}
