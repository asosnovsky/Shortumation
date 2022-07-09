import { Node, XYPosition } from "react-flow-renderer";
import { Bbox, Size } from "./types";

export const pointApply = (
  p1: XYPosition,
  p2: XYPosition,
  fcn: (a: number, b: number) => number
): XYPosition => ({
  x: fcn(p1.x, p2.x),
  y: fcn(p1.y, p2.y),
});

export const addSize = (p: XYPosition, size: Size): XYPosition => ({
  x: p.x + size.width,
  y: p.y + size.height,
});

export const updateBBox = (bbox: Bbox, p: XYPosition, size: Size): Bbox => {
  const ps = addSize(p, size);
  return [pointApply(bbox[0], ps, Math.min), pointApply(bbox[1], ps, Math.max)];
};

export const computeBBox = (nodes: Node[]): Bbox => {
  return nodes.reduce(
    (bbox: Bbox, n) => {
      const p0 = n.position;
      const height = n.data.height ?? n.style?.height;
      const width = n.data.width ?? n.style?.width;

      return updateBBox(bbox, p0, { height, width });
    },
    [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]
  );
};
