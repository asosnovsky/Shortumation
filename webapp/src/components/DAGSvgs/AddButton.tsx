import "./AddButton.css";
import { Point } from "types/graphs";
import { AddIcon } from '../Icons/index';



export interface AddProps {
  onClick?: () => void;
  loc: Point,
  height: number,
  width: number,
}
export const AddButton = ({
  loc: [x, y],
  height,
  width,
  onClick = () => { },
}: AddProps) => {
  return <>
    <foreignObject className="dag-svg--add-btn" x={x} y={y} width={width} height={height}>
      <AddIcon onClick={onClick} />
    </foreignObject>
  </>
}
