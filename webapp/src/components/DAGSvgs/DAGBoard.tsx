import { FC } from "react";
import { SVGBoard } from "./Board";
import { AutomationNode } from '../../types/automations/index';
import { Point, EdgeDirection, BBox } from 'types/graphs';
import { DAGNode } from "./DAGNode";
import { DAGEdge } from "./DAGEdge";
import { AddButton } from "./AddButton";
import { IteratorWrap } from "utils/iter";


export interface DAGNodeElm {
  type: 'node';
  key: string;
  loc: Point;
  node: AutomationNode;
  onRemove: () => void;
  onAdd?: () => void;
}
export interface DAGEdgeElm {
  type: 'edge';
  key: string;
  p1: Point;
  p2: Point;
  direction: EdgeDirection;
  toChild?: boolean;
}
export type DAGElement = DAGEdgeElm | DAGNodeElm;
export interface DAGBoardSettings extends DAGBoardElmDims {
  edgeChildColor: string;
  edgeNextColor: string;
}
export interface DAGBoardElmDims {
  nodeHeight: number;
  nodeWidth: number;
  addHeight: number;
  addWidth: number;
  distanceFactor: number;
}

export interface Props {
  elements: Generator<DAGElement>;
  settings: DAGBoardSettings;
}




export function* mapDataToElements({
  elements,
  settings: st,
}: Props) {
  let bbox: BBox = [[0, 0], [0, 0]];
  const updateBBox = (p: Point) => {
    bbox = [
      [Math.min(bbox[0][0], p[0]), Math.min(bbox[0][1], p[1])],
      [Math.max(bbox[1][0], p[0] + st.nodeWidth), Math.max(bbox[1][1], p[1] + st.nodeHeight)],
    ]
    return p;
  }
  const offsetPoint = (
    [x, y]: Point,
    [ox, oy]: Point = [0, 0]
  ): Point => updateBBox([x + ox, y + oy]);
  const mapWithNode = (
    [x, y]: Point,
    [ox, oy]: Point = [0, 0],
  ): Point => updateBBox([
    x * st.nodeWidth * st.distanceFactor + ox,
    y * st.nodeHeight * st.distanceFactor + oy,
  ])
  for (let elm of elements) {
    console.log({ elm })
    switch (elm.type) {
      case 'node':
        const nodeLoc = mapWithNode(elm.loc);
        const addLoc = mapWithNode(elm.loc, [
          st.nodeWidth * st.distanceFactor,
          st.addHeight + st.addHeight / 2
        ])
        yield <DAGNode
          key={elm.key}
          height={st.nodeHeight}
          width={st.nodeWidth}
          loc={nodeLoc}
          text={elm.node?.alias ?? elm.node.$smType}
          color={elm.node.$smType === 'action' ? 'green' : 'blue'}
          onXClick={elm.onRemove}
        />
        if (elm.onAdd) {
          yield <DAGEdge
            key={`${elm.key}-edge`}
            p1={offsetPoint(nodeLoc, [st.nodeWidth, st.nodeHeight / 2])}
            p2={offsetPoint(addLoc, [0, st.addHeight / 2])}
            direction="1->2"
            color={st.edgeNextColor}
          />
          yield <AddButton
            key={`${elm.key}-add`}
            loc={addLoc}
            height={st.addHeight}
            width={st.addWidth}
            onClick={elm.onAdd}
          />
        }
        break
      case 'edge':
        yield <DAGEdge
          key={elm.key}
          p1={mapWithNode(elm.p1, [st.nodeWidth, st.nodeHeight / 2])}
          p2={mapWithNode(elm.p2, [0, st.nodeHeight / 2])}
          direction={elm.direction}
          color={elm.toChild ? st.edgeChildColor : st.edgeNextColor}
        />
        break
      default:
        break
    }
  }
  return bbox;
}


export const DAGBoard: FC<Props & { zoomLevel: number }> = props => {
  const it = new IteratorWrap(mapDataToElements(props));
  const el = it.toArray();
  const [[x0, y0], [x1, y1]] = it.returnValue as BBox;
  return <SVGBoard
    graphHeight={y1 - y0}
    minGraphWidth={x1 - x0}
    nodeHeight={props.settings.nodeHeight}
    nodeWidth={props.settings.nodeWidth}
    zoomLevel={props.zoomLevel}
  >
    {el}
  </SVGBoard>
}
