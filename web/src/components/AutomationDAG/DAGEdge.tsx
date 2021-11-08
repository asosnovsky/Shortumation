import { NODE_HEIGHT, NODE_WIDTH } from "./constants"
import { EdgeDirection, Point } from "./types"



export interface EdgeProp {
    p1: Point,
    p2: Point,
    direction: EdgeDirection,
}
export default ({p1, p2, direction}: EdgeProp) => {
    const [x1,y1] = [p1[0] + NODE_WIDTH, p1[1]+NODE_HEIGHT/2]
    const [x2,y2] = [p2[0], p2[1]+NODE_HEIGHT/2]
    const [mx,my] = [(x1+x2)/2, (y1+y2)/2]
    const theta = Math.atan2(y2 -y1, x2-x1) -Math.PI / 2
    const cx1 =  x1 + NODE_WIDTH
    const cy1 = my - 30 * Math.cos(theta)
    const cx2 = x2 - NODE_WIDTH
    const cy2 = my + 30 * Math.cos(theta)

    return <>
    <circle cx={cx1} cy={cy1} stroke="red" r="1"/>
    <circle cx={cx2} cy={cy2} stroke="blue" r="1"/>
    <path className="edge" 
        d={ `M${x1} ${y1} C${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
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
