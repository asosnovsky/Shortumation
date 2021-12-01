// import "./DAGCircle.css";
import { Point } from "types/graphs";
import { AddIcon, PencilIcon } from '../Icons/index';
import { useCircleStyles } from './styles';



export interface AddProps {
  onEdit?: () => void;
  onAdd?: () => void;
  loc: Point,
  size: number,
}
export const DAGCircle = ({
  loc: [x, y],
  size,
  onEdit,
  onAdd,
}: AddProps) => {
  const { classes } = useCircleStyles({ size: size * 0.9 });
  console.log({ onEdit })
  return <>
    <foreignObject x={x} y={y} width={size} height={size}>
      <div className={classes.root}>
        {onEdit ?
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
            : "else"}
      </div>
    </foreignObject>
  </>
}
