import { EdgeDirection, Point } from "./types"



export interface EdgeProp {
    p1: Point,
    p2: Point,
    direction: EdgeDirection,
    className: string,
}
export default ({
    p1: [x1,y1], 
    p2: [x2,y2], 
    direction, 
    className,
}: EdgeProp) => {
    const [_,my] = [(x1+x2)/2, (y1+y2)/2]
    const theta = Math.atan2(y2 -y1, x2-x1)  - Math.PI / 2
    const cx1 =  x1 - 45 * Math.sin(theta) 
    const cy1 = my - 30 * Math.cos(theta)
    const cx2 = x2 + 45 * Math.sin(theta)
    const cy2 = my + 30 * Math.cos(theta)

    return <path className={className}
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
}
