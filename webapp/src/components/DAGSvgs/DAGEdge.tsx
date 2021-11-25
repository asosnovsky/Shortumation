import { EdgeDirection, Point } from "types/graphs"



export interface EdgeProp {
  p1: Point,
  p2: Point,
  direction: EdgeDirection,
  color: string,
  debug?: boolean,
}
export const DAGEdge = ({
  p1: [x1, y1],
  p2: [x2, y2],
  direction,
  color,
  debug = false,
}: EdgeProp) => {
  const [mx, my] = [(x1 + x2) / 2, (y1 + y2) / 2]
  let [cx1, cy1] = [(x1 + mx) / 2, (y1 + my) / 2]
  let [cx2, cy2] = [(x2 + mx) / 2, (y2 + my) / 2]
  const l1 = Math.sqrt((cy1 - y1) ** 2 + (cx1 - x1) ** 2)
  const l2 = Math.sqrt((cy2 - y2) ** 2 + (cx2 - x2) ** 2)
  const theta = Math.atan2(y2 - y1, x2 - x1)
  if ((theta < Math.PI / 2) && (theta > -Math.PI / 2)) {
    cy1 = y1 - 0.5 * l1 * Math.sin(theta)
    cx1 = x1 + 2 * l1 * Math.cos(theta)
    cy2 = y2
    cx2 = x2 - 3 * l2 * Math.cos(theta)
  } else if ((theta > Math.PI / 2) && (theta < Math.PI)) {
    cy2 += l2 * Math.sin(theta)
    cx2 += 10 * l2 * Math.cos(theta)
    cx1 -= 10 * l1 * Math.cos(theta)
  }

  return <>
    {debug && <>
      <circle cx={cx1} cy={cy1} r="5" fill="yellow" />
      <line x1={cx1} y1={cy1} x2={x1} y2={y1} stroke="yellow" />
      <line x1={cx1} y1={cy1} x2={x2} y2={y2} stroke="yellow" />
      <circle cx={cx2} cy={cy2} r="5" fill="green" />
      <line x1={cx2} y1={cy2} x2={x1} y2={y1} stroke="green" />
      <line x1={cx2} y1={cy2} x2={x2} y2={y2} stroke="green" />
      <text x={mx} y={my} stroke="white">{theta}</text>
    </>}
    <path stroke={color}
      d={`M${x1} ${y1} C${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
      fill="none"
      markerStart={
        (direction === '1<-2' || direction === '1<->2') ?
          "url(#arrow)" : ''
      }
      markerEnd={
        (direction === '1->2' || direction === '1<->2') ?
          "url(#arrow)" : ''
      }
    />
  </>
}
