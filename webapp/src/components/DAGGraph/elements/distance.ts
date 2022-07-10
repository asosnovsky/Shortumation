import { DAGDims, DAGEntities, Size } from "./types";
import { XYPosition } from "react-flow-renderer";

export const moveAlong = (
  by: keyof DAGEntities,
  startPoint: XYPosition,
  increment: number,
  dims: DAGDims,
  direction: "under" | "next" = "next"
): XYPosition => {
  const moveOnY = {
    y: startPoint.y + dims[by].height * dims.distanceFactor * increment,
    x: startPoint.x,
  };
  const moveOnX = {
    x: startPoint.x + dims[by].width * dims.distanceFactor * increment,
    y: startPoint.y,
  };
  if (direction === "next") {
    return dims.flipped ? moveOnX : moveOnY;
  } else {
    return !dims.flipped ? moveOnX : moveOnY;
  }
};

export const moveFromTo = (
  from: keyof DAGEntities,
  to: keyof DAGEntities,
  startPoint: XYPosition,
  dims: DAGDims
): XYPosition => {
  if (!dims.flipped) {
    return {
      x: startPoint.x + dims[from].width * dims.distanceFactor,
      y: startPoint.y + (dims[from].height - dims[to].height) / 2,
    };
  } else {
    return {
      y: startPoint.y + dims[from].height * dims.distanceFactor,
      x: startPoint.x + (dims[from].width - dims[to].width) / 2,
    };
  }
};

export const computeSize = (
  by: keyof DAGEntities,
  dims: DAGDims,
  count: number,
  direction: "under" | "next" = "next"
): Size => {
  const moveOnY = {
    height: dims[by].height * count,
    width: dims[by].width * dims.distanceFactor,
  };
  const moveOnX = {
    width: dims[by].width * count,
    height: dims[by].height * dims.distanceFactor,
  };
  if (direction === "next") {
    return dims.flipped ? moveOnX : moveOnY;
  } else {
    return !dims.flipped ? moveOnX : moveOnY;
  }
};
