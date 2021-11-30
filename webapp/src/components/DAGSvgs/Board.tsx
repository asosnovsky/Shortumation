import "./Board.css";
import { FC, useState } from 'react';
import { Point } from 'types/graphs';
import useWindowSize from "utils/useWindowSize";
import { useBoardStyles } from "./styles";


export const SVGBoard: FC<{
  graphHeight?: number,
  children?: JSX.Element;
}> = ({
  children,
  graphHeight = 300,
}) => {

    // state
    const { ratioWbh } = useWindowSize();
    const { classes, theme } = useBoardStyles({});
    const [[offX, offY], setOffset] = useState<Point>([0, 0])

    // alias
    const graphWidth = Math.round(graphHeight * ratioWbh);

    // render
    return <div className={classes.root} style={{
      flexDirection: ratioWbh >= 0.75 ? 'row' : 'column'
    }}>
      <div className={classes.dag}>
        <svg
          className={classes.svg}
          viewBox={[offX, offY, graphWidth + offX, graphHeight + offY].join(" ")}
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
      <div className="board-btn top" onClick={() => setOffset([offX, offY - 10])}></div>
      <div className="board-btn left" onClick={() => setOffset([offX - 10, offY])}></div>
      <div className="board-btn right" onClick={() => setOffset([offX + 10, offY])}></div>
      <div className="board-btn bottom" onClick={() => setOffset([offX, offY + 10])}></div>
    </div>
  }
