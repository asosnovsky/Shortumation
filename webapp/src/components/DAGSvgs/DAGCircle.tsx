// import "./DAGCircle.css";
import { Point } from "types/graphs";
import { PencilIcon } from '../Icons/index';
import { useCircleStyles } from './styles';



export interface AddProps {
  onClick?: () => void;
  loc: Point,
  size: number,
}
export const DAGCircle = ({
  loc: [x, y],
  size,
  onClick,
}: AddProps) => {
  const { classes } = useCircleStyles({ size: size * 0.9 });
  console.log({ onClick })
  return <>
    <foreignObject x={x} y={y} width={size} height={size}>
      <div className={classes.root}>
        {onClick ? <PencilIcon size={70} units="%" className={classes.icon} onClick={onClick} /> : "else"}
      </div>
    </foreignObject>
  </>
}
