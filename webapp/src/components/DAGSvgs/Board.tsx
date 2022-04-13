import { FC } from 'react';
import useWindowSize from "utils/useWindowSize";
import { useBoardStyles } from "./styles";
import { NODE_HEIGHT, NODE_WIDTH } from './constants';


export const SVGBoard: FC<{
  graphHeight?: number,
  minGraphWidth?: number,
  nodeHeight?: number,
  nodeWidth?: number,
  zoomLevel?: number,
}> = ({
  children,
  graphHeight = 300,
  minGraphWidth = 300,
  nodeHeight = NODE_HEIGHT,
  nodeWidth = NODE_WIDTH,
  zoomLevel = 100,
}) => {

    // state
    const { ratioWbh } = useWindowSize();
    // alias
    const paddedZoomLevel = zoomLevel / 100;
    const graphWidth = Math.max(
      Math.round(graphHeight * ratioWbh),
      minGraphWidth
    );
    const { classes, theme } = useBoardStyles({
      boardHeight: Math.max(nodeHeight, graphHeight) * paddedZoomLevel,
      boardWidth: Math.max(4 * nodeWidth, graphWidth) * paddedZoomLevel,
    });
    // render
    return <div className={classes.dag} >
      <svg
        className={classes.svg}
        viewBox={[0, 0, graphWidth / paddedZoomLevel, graphHeight / paddedZoomLevel].join(" ")}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.secondaryAccent} />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  }
