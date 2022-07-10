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
