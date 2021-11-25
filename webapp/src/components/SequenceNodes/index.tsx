import { FC } from "react";
import { useTheme } from "styles/theme";
import { computeNodesEdges } from './location';
import { SequenceNodeSettings } from './types';


export const SequenceNodes: FC<SequenceNodeSettings> = (props) => {
  const theme = useTheme();

  return <>
    {Array.from(computeNodesEdges({
      ...props,
      keyPrefix: "",
      edgeColor: theme.secondaryAccent,
    }))}
  </>
}
