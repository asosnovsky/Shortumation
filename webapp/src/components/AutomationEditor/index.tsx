import "./index.css";
import "./index.mobile.css";

import { FC, useState } from "react";

import Skeleton from "@mui/material/Skeleton";
import LinearProgress from "@mui/material/LinearProgress";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import SpeedDialIcon from "@mui/icons-material/SettingsRounded";
import UndoIcon from "@mui/icons-material/UndoSharp";
import EditIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { CheckMarkIcon } from "components/Icons";
import RunIcon from "@mui/icons-material/RunCircleOutlined";

import { Modal } from "components/Modal";
import { Button } from "components/Inputs/Buttons/Button";
import InputYaml from "components/Inputs/Base/InputYaml";
import { TagDB } from "components/AutomationManager/TagDB";
import { DAGDims } from "components/DAGGraph/elements/types";
import { DAGAutomationGraph } from "components/DAGGraph";
import { InputList } from "components/Inputs/InputList";
import { InputTextView } from "components/Inputs/InputTextView";

import { AutomationData, BareAutomationData } from "types/automations";
import { MiniFailure } from "types/validators/helper";

import { AutoInfoBox } from "./AutoInfoBox";
import { useAutomatioEditorState, EditorData } from "./state";
import { useLang } from "services/lang";
import { useSnackbar } from "notistack";
import { Alert } from "@mui/material";
import { useUserProfile } from "services/api";
import {
  ControlButton,
  ReactFlowProvider,
  useReactFlow,
} from "react-flow-renderer";
import FitInIcon from "@mui/icons-material/FitScreenRounded";
import FullscreenIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExitRounded";
import { useEffect } from "react";
interface Props {
  automation?: AutomationData | BareAutomationData;
  dims: DAGDims;
  onUpdate: (auto: AutomationData | BareAutomationData) => void;
  onTrigger: () => void;
  onDelete: () => void;
  tagDB: TagDB;
  isNew?: boolean;
  readonly: boolean;
  issue?: string;
}
export const AutomationEditor: FC<Props> = (props) => {
  return (
    <ReactFlowProvider>
      <AutomationEditorInner {...props} />
    </ReactFlowProvider>
  );
};
export const AutomationEditorInner: FC<Props> = ({
  dims,
  automation: propsAutos,
  onUpdate: propsOnUpdate,
  onDelete,
  onTrigger,
  tagDB,
  readonly,
  issue,
}) => {
  // state
  const reactFlow = useReactFlow();
  const userProfile = useUserProfile();
  const langStore = useLang();
  const snackbr = useSnackbar();
  const {
    state,
    updateSequence,
    updateTrigger,
    updateMetadata,
    updateCondition,
    validate,
    save,
    saveAndUpdate,
    undo,
  } = useAutomatioEditorState(propsAutos, (auto) => {
    if (readonly) {
      snackbr.enqueueSnackbar(langStore.get("READONLY_CANNOT_UPDATE"), {
        color: "warning",
      });
    } else {
      propsOnUpdate(auto);
    }
  });
  const [infoBoxOpen, setInfoBox] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  // alias
  const flipped = userProfile.flags.flipped ?? !dims.flipped;
  const useNodesRow = userProfile.flags.useNodesRow !== false;
  // effect
  useEffect(() => {
    if (reactFlow) {
      setTimeout(() => {
        reactFlow.fitView();
      }, 500);
    }
  }, [flipped, fullScreenMode, reactFlow]);
  // render
  if (state.status === "loading") {
    return (
      <div className="automation-editor loading">
        <LinearProgress className="linear-loader" />
        <Skeleton className="mock-list" variant="rectangular" />
        <Skeleton className="mock-graph" variant="rectangular" />
      </div>
    );
  }
  if (state.status === "invalid") {
    return (
      <ValidationBox
        failures={state.failures}
        data={state.data}
        validate={validate}
        onSave={saveAndUpdate}
      />
    );
  }
  return (
    <div
      className={[
        "automation-editor",
        state.status,
        readonly ? "readonly" : "",
        fullScreenMode ? "fullscreen" : "",
      ].join(" ")}
    >
      {state.status === "saving" && (
        <LinearProgress className="linear-loader" />
      )}
      <Modal open={infoBoxOpen}>
        <AutoInfoBox
          metadata={state.data}
          tags={state.data.tags}
          onUpdate={updateMetadata}
          tagDB={tagDB}
        >
          <div
            className={[
              "automation-editor--info-box--buttons",
              state.status,
            ].join(" ")}
          >
            <Button onClick={() => setInfoBox(false)}>
              {langStore.get("CLOSE")}
            </Button>
            <Button
              className={"automation-editor--flow-wrapper--toolbar--save-btn"}
              onClick={save}
              disabled={state.status !== "changed" || readonly}
            >
              {langStore.get("SAVE")} <CheckMarkIcon color="#bf4" />
            </Button>
          </div>
        </AutoInfoBox>
      </Modal>

      <div
        className={["automation-editor--flow-wrapper", state.status].join(" ")}
      >
        <div className="automation-editor--flow-wrapper--toolbar">
          <div className="automation-editor--flow-wrapper--toolbar--title">
            <span className="automation-editor--flow-wrapper--toolbar--title--text">
              <div className="id">{state.data.id}</div>
              <InputTextView
                value={state.data.alias ?? ""}
                placeholder={langStore.get("NAME")}
                onChange={(alias) =>
                  updateMetadata(
                    {
                      ...state.data,
                      alias,
                    },
                    state.data.tags
                  )
                }
              />
            </span>
            <InputList
              fullWidth={false}
              label={langStore.get("MODE")}
              className="automation-editor--flow-wrapper--toolbar--modes"
              current={{
                id: state.data.mode,
                label: "",
              }}
              onChange={({ id }) =>
                updateMetadata(
                  {
                    ...state.data,
                    mode: id,
                  },
                  state.data.tags
                )
              }
              getKey={({ id }) => id}
              getDescription={({ label }) => label}
              options={[
                {
                  id: "single",
                  label: langStore.get("MODE_SIGNLE_LABEL"),
                },
                {
                  id: "parallel",
                  label: langStore.get("MODE_SIGNLE_PARALLEL"),
                },
                {
                  id: "queued",
                  label: langStore.get("MODE_SIGNLE_QUEUED"),
                },
                {
                  id: "restart",
                  label: langStore.get("MODE_SIGNLE_RESTART"),
                },
              ]}
            />
            <InputTextView
              className="description"
              value={state.data.description ?? ""}
              placeholder={langStore.get("DESCRIPTION")}
              onChange={(description) =>
                updateMetadata(
                  {
                    ...state.data,
                    description,
                  },
                  state.data.tags
                )
              }
            />
          </div>
          {state.status === "changed" && (
            <Button onClick={undo}>
              <UndoIcon />
            </Button>
          )}
          <Button
            className={"automation-editor--flow-wrapper--toolbar--save-btn"}
            onClick={save}
            disabled={state.status !== "changed"}
          >
            {langStore.get("SAVE")} <CheckMarkIcon color="#bf4" />
          </Button>
        </div>
        {readonly && (
          <Alert color="warning">
            {langStore.get("READONLY_MODE")} - {issue}
          </Alert>
        )}
        <DAGAutomationGraph
          action={state.data.action}
          trigger={state.data.trigger}
          condition={state.data.condition}
          onActionUpdate={updateSequence}
          onTriggerUpdate={updateTrigger}
          onConditionUpdate={updateCondition}
          isFlipped={flipped}
          useNodesRow={useNodesRow}
          additionalControls={
            <>
              <ControlButton onClick={() => setFullScreenMode(!fullScreenMode)}>
                {fullScreenMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </ControlButton>
              <ControlButton onClick={() => reactFlow.fitView()}>
                <FitInIcon />
              </ControlButton>
            </>
          }
        />
        <SpeedDial
          ariaLabel="options label"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
          }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            // tooltipOpen
            sx={{ pointerEvents: "auto" }}
            icon={<RunIcon />}
            tooltipTitle={langStore.get("TRIGGER")}
            onClick={onTrigger}
          />
          <SpeedDialAction
            // tooltipOpen
            icon={<DeleteIcon />}
            tooltipTitle={langStore.get("DELETE")}
            onClick={onDelete}
          />
          <SpeedDialAction
            // tooltipOpen
            icon={<EditIcon />}
            tooltipTitle={langStore.get("METADATA")}
            onClick={() => setInfoBox(!infoBoxOpen)}
          />
          {state.status === "changed" && (
            <SpeedDialAction
              // tooltipOpen
              icon={<UndoIcon />}
              tooltipTitle={langStore.get("UNDO")}
              onClick={undo}
            />
          )}
        </SpeedDial>
      </div>
    </div>
  );
};

export const ValidationBox: FC<{
  failures: MiniFailure[];
  validate: (d: any) => MiniFailure[] | null;
  data: EditorData;
  onSave: (d: EditorData) => void;
}> = (props) => {
  const langStore = useLang();
  const [{ failures, data }, setState] = useState({
    failures: props.failures,
    data: props.data,
  });

  const onSave = (d: EditorData) => {
    const newData = {
      ...data,
      ...d,
    };
    const newFails = props.validate(newData);
    if (newFails) {
      setState({
        failures: newFails,
        data: newData,
      });
    } else {
      setState({
        failures: [],
        data: newData,
      });
    }
  };

  return (
    <div className="automation-editor-failures">
      <ul>
        {failures.map((f, i) => (
          <li key={i}>
            <b>{f.path}</b>:
            <ul>
              {f.message.map((m, j) => (
                <li key={j}>{m}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <span>{langStore.get("VALIDATION_PLEASE_CORRECT_FILE")}</span>
      <InputYaml label={langStore.get("RAW")} value={data} onChange={onSave} />
      <Button disabled={failures.length > 0} onClick={() => props.onSave(data)}>
        {langStore.get("SAVE")}
      </Button>
    </div>
  );
};
