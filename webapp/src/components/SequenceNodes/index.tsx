import { FC } from "react";
import { useTheme } from "styles/theme";
import { Point } from "types/graphs";
import { AutomationSequenceNode } from '../../types/automations/index';
import { computeNodesEdges } from './location';


export const SequenceNodes: FC<{
  startLoc: Point,
  sequence: AutomationSequenceNode[],
  nodeHeight: number,
  nodeWidth: number,
  distanceFactor: number,
}> = ({
  startLoc,
  sequence,
  nodeHeight,
  nodeWidth,
  distanceFactor,
}) => {
  const theme = useTheme();

  return <>
    {Array.from(computeNodesEdges(
      startLoc,
      nodeWidth,
      nodeHeight,
      distanceFactor,
      sequence,
      theme.secondaryAccent,
    ))}
  </>
}
