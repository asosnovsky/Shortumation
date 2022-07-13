import { MarkerType, Edge, XYPosition } from "react-flow-renderer";
import { DAGAutomationFlowNode } from "../nodes";
import { addSize, pointApply } from "./math";
import { Bbox, DAGDims, DAGEntities, ElementData, LastNode } from "./types";
import { moveAlong } from "./distance";

export class DAGElementsOutputState {
  public data: ElementData = {
    nodes: [],
    edges: [],
  };
  public lastNode?: LastNode;
  public bbox: Bbox = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  constructor(public nextPos: XYPosition, public dims: DAGDims) {}

  public extend(
    other: DAGElementsOutputState,
    ignoreLastNode: boolean = false
  ) {
    this.data.nodes = this.data.nodes.concat(other.data.nodes);
    this.data.edges = this.data.edges.concat(other.data.edges);
    this.bbox[0] = pointApply(this.bbox[0], other.bbox[0], Math.min);
    this.bbox[1] = pointApply(this.bbox[1], other.bbox[1], Math.max);
    if (!ignoreLastNode) {
      this.lastNode = other.lastNode;
      this.nextPos = (this.lastNode as any).pos;
    }
    if (this.dims.flipped) {
      this.nextPos = {
        y: Math.max(this.nextPos.y, other.bbox[1].y),
        x: this.nextPos.x,
      };
    } else {
      this.nextPos = {
        x: Math.max(this.nextPos.x, other.bbox[1].x),
        y: this.nextPos.y,
      };
    }
  }

  public addNode(
    node: DAGAutomationFlowNode,
    addEdge: boolean = false,
    animatedEdge: boolean = false
  ) {
    if (addEdge && this.lastNodeId) {
      this.addEdge(this.lastNodeId, node.id, {
        animated: animatedEdge,
      });
    }
    this.data.nodes.push(node);
    this.bbox[0] = pointApply(this.bbox[0], node.position, Math.min);
    this.bbox[1] = pointApply(
      this.bbox[1],
      addSize(node.position, node.data),
      Math.max
    );
    this.lastNode = {
      nodeId: node.id,
      pos: node.position,
      size: {
        height: node.data.height,
        width: node.data.width,
      },
    };
    return node;
  }

  public addEdge(from: string, to: string, edgeProps: Partial<Edge> = {}) {
    this.data.edges.push({
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 25,
        height: 25,
      },
      ...edgeProps,
      id: `${from}->${to}`,
      source: from,
      target: to,
    });
  }

  public get lastNodeId() {
    if (this.lastNode) {
      return this.lastNode.nodeId;
    }
    return undefined;
  }

  public getLastNodePos(orThis: XYPosition | undefined = undefined) {
    if (this.lastNode) {
      return this.lastNode.pos;
    }
    if (orThis) {
      return orThis;
    }
    throw Error("missing lastnode");
  }

  public incNextPos(by: keyof DAGEntities) {
    if (!this.lastNode) {
      return;
    }
    this.nextPos = moveAlong(by, this.nextPos, 1, this.dims);
  }
}
