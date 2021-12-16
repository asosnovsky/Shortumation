import { DAGBoardElmDims } from "components/DAGSvgs/DAGBoard";
import { SequenceNodes } from "components/SequenceNodes";
import { FC } from "react";
import { AutomationData, AutomationSequenceNode } from "types/automations";
import useWindowSize from "utils/useWindowSize";
import { AutoInfoBox } from "./AutoInfoBox";
import { useEditorStyles } from "./styles";


interface Props {
  automation: AutomationData;
  dims: DAGBoardElmDims;
  onUpdate: (auto: AutomationData) => void;
}
export const AutomationEditor: FC<Props> = ({
  dims,
  automation,
  onUpdate,
}) => {
  // state
  const { ratioWbh } = useWindowSize();
  const { classes } = useEditorStyles({});

  // alias
  const updateSequence = (sequence: AutomationSequenceNode[]) => onUpdate({
    ...automation,
    sequence,
  });

  // render
  return <div className={classes.root} style={{
    flexDirection: ratioWbh >= 0.75 ? 'row' : 'column'
  }}>
    <AutoInfoBox
      className={classes.infoBox}
      metadata={automation.metadata}
      onUpdate={metadata => onUpdate({ ...automation, metadata })}
    />
    <SequenceNodes
      zoomLevel={1.5}
      startPoint={[0.5, 0.5]}
      dims={dims}
      sequence={automation.sequence}
      onChange={updateSequence}
    />
  </div>
}
