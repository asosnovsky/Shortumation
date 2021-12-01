import { DAGBoard } from "components/DAGSvgs/DAGBoard";
import { FC } from "react";
import { useTheme } from "styles/theme";
import { SequenceNodeProps } from './types';
import Color from 'chroma-js';
import { computeNodesEdgesPos } from './positions';

export const SequenceNodes: FC<SequenceNodeProps & { zoomLevel: number }> = (props) => {
  const theme = useTheme();

  // return <>
  //   {Array.from(computeNodesEdges({
  //     ...props,
  //     keyPrefix: "",
  //     edgeColor: theme.secondaryAccent,
  //   }))}
  // </>
  return <DAGBoard
    zoomLevel={props.zoomLevel}
    elements={computeNodesEdgesPos(
      props.startPoint,
      props.sequence,
      props.onChange
    )}
    settings={{
      ...props.dims,
      edgeNextColor: theme.secondaryAccent,
      edgeChildColor: Color(theme.secondaryAccent).set('rgb.b', 200).hex(),
    }}
  />
}
