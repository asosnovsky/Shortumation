import { DAGDims, DAGEntities } from "./types";
import { XYPosition } from "react-flow-renderer";

export const moveAlong = (
  by: keyof DAGEntities,
  startPoint: XYPosition,
  increment: number,
  dims: DAGDims,
  reversed: boolean = false
): XYPosition => {
  const moveOnY = {
    y: startPoint.y + dims[by].height * dims.distanceFactor[by][0] * increment,
    x: startPoint.x,
  };
  const moveOnX = {
    x: startPoint.x + dims[by].width * dims.distanceFactor[by][1] * increment,
    y: startPoint.y,
  };
  if (reversed) {
    return dims.flipped ? moveOnX : moveOnY;
  }
  return !dims.flipped ? moveOnX : moveOnY;
};

export const moveAlongRelativeTo = (
  offsetPos: XYPosition,
  relatedPos: XYPosition,
  dims: DAGDims,
  incrementBy: keyof DAGEntities = "collection"
) =>
  dims.flipped
    ? {
        x:
          relatedPos.x +
          dims.distanceFactor[incrementBy][0] * dims[incrementBy].width,
        y: offsetPos.y,
      }
    : {
        y:
          relatedPos.y +
          dims.distanceFactor[incrementBy][1] * dims[incrementBy].height,
        x: offsetPos.x,
      };

export const moveFromTo = (
  from: keyof DAGEntities,
  to: keyof DAGEntities,
  startPoint: XYPosition,
  dims: DAGDims,
  byFrom: boolean = false
): XYPosition => {
  if (!dims.flipped) {
    return {
      x:
        startPoint.x +
        dims[from].width * dims.distanceFactor[byFrom ? from : to][0],
      y: startPoint.y + (dims[from].height - dims[to].height) / 2,
    };
  } else {
    return {
      y:
        startPoint.y +
        dims[from].height * dims.distanceFactor[byFrom ? from : to][1],
      x: startPoint.x + (dims[from].width - dims[to].width) / 2,
    };
  }
};

export const offsetBy = (
  by: keyof DAGEntities,
  position: XYPosition,
  dims: DAGDims
): XYPosition => ({
  x: position.x + dims.distanceFactor[by][0] * 0.9 * dims[by].width,
  y: position.y + dims.distanceFactor[by][1] * 0.9 * dims[by].height,
});
