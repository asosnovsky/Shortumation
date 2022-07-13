import { DAGAutomationFlowNode } from "../nodes";
import { addSize, pointApply } from "./math";
import { Bbox, ElementData, LastNode } from "./types";

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
    }
  }

  public addNode(
    node: DAGAutomationFlowNode,
    addEdge: boolean = false,
    animatedEdge: boolean = false
  ) {
    if (addEdge && this.lastNodeId) {
      this.addEdge(this.lastNodeId, node.id, animatedEdge);
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

  public addEdge(
    from: string,
    to: string,
    animated: boolean = false,
    label: string | undefined = undefined
  ) {
    this.data.edges.push({
      id: `${from}->${to}`,
      source: from,
      target: to,
      label,
      animated,
    });
  }

  public get lastNodeId() {
    if (this.lastNode) {
      return this.lastNode.nodeId;
    }
    return undefined;
  }

  public get lastNodePos() {
    if (this.lastNode) {
      return this.lastNode.pos;
    }
    throw Error("missing lastnode");
  }
}
