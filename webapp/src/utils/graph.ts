import { Point } from "types/graphs";

export const offsetPoint = (
  [x, y]: Point,
  [ox, oy]: Point = [0, 0],
): Point => [x + ox, y + oy];

export const avgPoints = (
  [x1, y1]: Point,
  [x2, y2]: Point,
): Point => [(x1 + x2)/2, (y1 + y2)/2];

export const makeOffsetMaintainer = (startPoint: Point) => {
  let offset: Point = [0, 0];
  let i = 0;
  return {
    setI(newI: number) {
      i = newI;
    },
    resetY() {
      offset[1] = 0;
    },
    update(p: Point, innerStartLoc: Point) {
      offset[0] = Math.max(offset[0], p[0] - i - 0.5 - startPoint[0])
      offset[1] = Math.max(offset[1], p[1] - innerStartLoc[1] + 1)
    },
    get x() {
      return offset[0]
    },
    get y() {
      return offset[1]
    }
  }
}
