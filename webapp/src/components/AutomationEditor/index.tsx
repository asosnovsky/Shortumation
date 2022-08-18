import "./index.css";
import "./index.mobile.css";

import { FC, useState } from "react";
import { useCookies } from "react-cookie";

import Skeleton from "@mui/material/Skeleton";
import LinearProgress from "@mui/material/LinearProgress";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import SpeedDialIcon from "@mui/icons-material/SettingsRounded";
import UndoIcon from "@mui/icons-material/UndoSharp";
import Icon from "@mui/material/Icon";
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

interface Props {
  automation?: AutomationData | BareAutomationData;
  dims: DAGDims;
  onUpdate: (auto: AutomationData | BareAutomationData) => void;
  onTrigger: () => void;
  onDelete: () => void;
  tagDB: TagDB;
  isNew?: boolean;
}
export const AutomationEditor: FC<Props> = ({
  dims,
  automation: propsAutos,
  onUpdate: propsOnUpdate,
  onDelete,
  onTrigger,
  tagDB,
  isNew,
}) => {
  // state
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
  } = useAutomatioEditorState(propsAutos, propsOnUpdate);
  const [infoBoxOpen, setInfoBox] = useState(false);
  const [
    { ckFlipped },
    setCookies,
    // eslint-disable-next-line
    _,
  ] = useCookies(["ckFlipped"]);
  // alias
  const flipped = dims.flipped ? true : ckFlipped === "1";
  const setFlipped = (v: boolean) => setCookies("ckFlipped", v ? "1" : "0");
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
    <div className={["automation-editor", state.status].join(" ")}>
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
            <Button onClick={() => setInfoBox(false)}>Close</Button>
            <Button
              className={"automation-editor--flow-wrapper--toolbar--save-btn"}
              onClick={save}
              disabled={state.status !== "changed"}
            >
              Save <CheckMarkIcon color="#bf4" />
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
                placeholder="Name"
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
              label="Mode"
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
                  label: "Do not start a new run. Issue a warning.",
                },
                {
                  id: "parallel",
                  label:
                    "Start a new, independent run in parallel with previous runs.",
                },
                {
                  id: "queued",
                  label:
                    "Start a new run after all previous runs complete. Runs are guaranteed to execute in the order they were queued.",
                },
                {
                  id: "restart",
                  label: "Start a new run after first stopping previous run.",
                },
              ]}
            />
            <InputTextView
              className="description"
              value={state.data.description ?? ""}
              placeholder="Description"
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
          {!dims.flipped && (
            <Button
              className={"automation-editor--flow-wrapper--toolbar--flip-btn"}
              onClick={() => setFlipped(!flipped)}
            >
              <Icon>{flipped ? "flip_to_front" : "flip_to_back"}</Icon>
              Flip
            </Button>
          )}
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
            Save <CheckMarkIcon color="#bf4" />
          </Button>
        </div>
        <DAGAutomationGraph
          action={state.data.action}
          trigger={state.data.trigger}
          condition={state.data.condition}
          onActionUpdate={updateSequence}
          onTriggerUpdate={updateTrigger}
          onConditionUpdate={updateCondition}
          isFlipped={flipped}
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
            tooltipTitle={"Trigger"}
            onClick={onTrigger}
          />
          <SpeedDialAction
            // tooltipOpen
            icon={<DeleteIcon />}
            tooltipTitle={"Delete"}
            onClick={onDelete}
          />
          <SpeedDialAction
            // tooltipOpen
            icon={<EditIcon />}
            tooltipTitle={"Metadata"}
            onClick={() => setInfoBox(!infoBoxOpen)}
          />
          {state.status === "changed" && (
            <SpeedDialAction
              // tooltipOpen
              icon={<UndoIcon />}
              tooltipTitle={"Undo"}
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
          <>
            <li key={i}>
              <b>{f.path}</b>:
              <ul>
                {f.message.map((m, j) => (
                  <li key={j}>{m}</li>
                ))}
              </ul>
            </li>
          </>
        ))}
      </ul>
      <span>
        Please correct the automation file manually and then continue!
      </span>
      <InputYaml label="Raw" value={data} onChange={onSave} />
      <Button disabled={failures.length > 0} onClick={() => props.onSave(data)}>
        Save
      </Button>
    </div>
  );
};
