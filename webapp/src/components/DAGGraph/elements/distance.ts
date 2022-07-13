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
    y: startPoint.y + dims[by].height * dims.distanceFactor.node * increment,
    x: startPoint.x,
  };
  const moveOnX = {
    x: startPoint.x + dims[by].width * dims.distanceFactor.node * increment,
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
  incrementBy: keyof DAGEntities = "condition"
) =>
  dims.flipped
    ? {
        x:
          relatedPos.x +
          (dims.distanceFactor.node - 1) * dims[incrementBy].width,
        y: offsetPos.y,
      }
    : {
        y:
          relatedPos.y +
          (dims.distanceFactor.node - 1) * dims[incrementBy].height,
        x: offsetPos.x,
      };

export const moveFromTo = (
  from: keyof DAGEntities,
  to: keyof DAGEntities,
  startPoint: XYPosition,
  dims: DAGDims
): XYPosition => {
  if (!dims.flipped) {
    return {
      x: startPoint.x + dims[from].width * dims.distanceFactor.collection,
      y: startPoint.y + (dims[from].height - dims[to].height) / 2,
    };
  } else {
    return {
      y: startPoint.y + dims[from].height * dims.distanceFactor.collection,
      x: startPoint.x + (dims[from].width - dims[to].width) / 2,
    };
  }
};
