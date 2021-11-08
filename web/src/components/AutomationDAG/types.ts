

export type Point = [number, number];
export interface Node {
    loc: Point;
    text: string;
}
export interface Edge {
    from: number;
    to: number;
    direction: '1->2' | '1<->2' | '1<-2';
}
export type EdgeDirection = Edge['direction'];
export interface DAG {
    nodes: Array<Node>;
    edges: Array<Edge>;
}