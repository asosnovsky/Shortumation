import { DAGBoardElmDims } from "components/DAGSvgs/DAGBoard";
import { InfoIcon } from "components/Icons";
import { Button } from "components/Inputs/Button";
import { SequenceNodes } from "components/SequenceNodes";
import { FC, useState } from "react";
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
  const [closeInfo, setCloseInfo] = useState(false);
  const { classes } = useEditorStyles({
    closeInfo,
    horizontalMode: ratioWbh < 0.75
  });

  // alias
  const updateSequence = (sequence: AutomationSequenceNode[]) => onUpdate({
    ...automation,
    sequence,
  });

  // render
  return <div className={classes.root}>
    <AutoInfoBox
      className={classes.infoBox}
      metadata={automation.metadata}
      onUpdate={metadata => onUpdate({ ...automation, metadata })}
    />
    <InfoIcon
      className={classes.infoIcon}
      onClick={() => setCloseInfo(!closeInfo)}
      title={closeInfo ? "Show Metadata" : "Hide Metadata"}
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
