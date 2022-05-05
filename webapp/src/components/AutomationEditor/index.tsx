import "./index.css";
import { ArrowIcon, CheckMarkIcon, ZoomIcon } from "components/Icons";
import { FC, useState } from "react";
import { AutomationData } from "types/automations";
import useWindowSize from "utils/useWindowSize";
import { AutoInfoBox } from "./AutoInfoBox";
import { useEditorStyles } from "./styles";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { Button } from "components/Inputs/Button";
import { useAutomatioEditorState } from "./state";
import { DAGAutomationFlow } from "components/DAGFlow";
import { DAGAutomationFlowDims } from "components/DAGFlow/types";

interface Props {
  automation: AutomationData;
  dims: DAGAutomationFlowDims;
  onUpdate: (auto: AutomationData) => void;
}
export const AutomationEditor: FC<Props> = ({
  dims,
  automation: propsAutos,
  onUpdate: propsOnUpdate,
}) => {
  // state
  const {
    state,
    updateSequence,
    updateTrigger,
    updateMetadata,
    save,
  } = useAutomatioEditorState(propsAutos, propsOnUpdate);

  const { ratioWbh } = useWindowSize();
  const [closeInfo, setCloseInfo] = useState(false);
  const { classes } = useEditorStyles({
    closeInfo,
    horizontalMode: ratioWbh < 0.75,
    autoChanged: state.status,
  });


  // render
  if (state.status === 'loading') {
    return <div className={classes.root}>
      Loading...
    </div>
  }
  return <div className={classes.root}>
    <AutoInfoBox
      className={closeInfo ? "hide" : "show"}
      metadata={state.data.metadata}
      tags={state.data.tags}
      onUpdate={updateMetadata}
    >
      <ButtonIcon
        className={`${classes.infoIcon} automation-editor--info-icon`}
        onClick={() => setCloseInfo(!closeInfo)}
        title={closeInfo ? "Show Metadata" : "Hide Metadata"}
      >{ArrowIcon}</ButtonIcon>
    </AutoInfoBox>

    <div className={classes.wrapper}>
      <div className={classes.toolbar}>
        <span></span>
        <Button
          className={classes.saveBtn}
          onClick={save}
          disabled={state.status !== 'changed'}
        >
          Save <CheckMarkIcon color="#bf4" />
        </Button>
      </div>
      <DAGAutomationFlow
        sequence={state.data.sequence}
        trigger={state.data.trigger}
        onSequenceUpdate={updateSequence}
        onTriggerUpdate={updateTrigger}
        dims={dims}
      />
    </div>
  </div>
}
