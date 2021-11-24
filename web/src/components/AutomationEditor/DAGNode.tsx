import Color from "chroma-js";
import { PencilIcon } from "~/icons/icons"
import { NODE_HEIGHT, NODE_WIDTH } from "./constants"
import { useNodeStyles } from "./styles"
import { Node } from "./types"



export interface NodeProp extends Node {
  height?: number;
  width?: number;
  onXClick?: () => void;
  onOpenClick?: () => void;
}
export default ({
  loc: [x, y],
  text,
  height = NODE_HEIGHT,
  width = NODE_WIDTH,
  onXClick = () => { },
  onOpenClick = () => { },
  color,
}: NodeProp) => {
  const { classes, theme } = useNodeStyles({
    color,
    nodeHeight: height,
    nodeWidth: width,
  });
  return <foreignObject x={x} y={y} width={width} height={height}>
    <div className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.leftEdge} onClick={onXClick}>
          <button className={classes.buttonDelete}>X</button>
        </div>
        <div className={classes.textWrap}>
          <span className={classes.text}>
            {text}
          </span>
        </div>
        <div className={classes.rightEdge} onClick={onOpenClick}>
          <button className={classes.buttonEdit}>
            <PencilIcon size={1.1} color={Color(theme.primary).set('rgb.g', 200).hex()} />
          </button>
        </div>
      </div>
    </div>
  </foreignObject>
}
