export type Point = [number, number];
export type BBox = [Point, Point];
export type NodeColor = 'red' | 'blue' | 'green';
export interface Node {
  loc: Point;
  text: string;
  color: NodeColor;
}
export type EdgeDirection = '1->2' | '1<->2' | '1<-2';
export interface BoundedObj<J> {
  elm: J;
  bbox: BBox;
}
