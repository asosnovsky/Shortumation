import "./index.css";
import Icon from "@mui/material/Icon";
import { CheckMarkIcon } from "components/Icons";
import { FC, useState } from "react";
import { AutomationData } from "types/automations";
import { Modal } from "components/Modal";
import { AutoInfoBox } from "./AutoInfoBox";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import { Button } from "components/Inputs/Button";
import { useAutomatioEditorState, EditorData } from "./state";
import { MiniFailure } from "types/validators/helper";
import InputYaml from "components/Inputs/InputYaml";
import { TagDB } from "components/AutomationList/TagDB";
import Skeleton from "@mui/material/Skeleton";
import LinearProgress from "@mui/material/LinearProgress";
import { useCookies } from "react-cookie";
import { DAGDims } from "components/DAGGraph/elements/types";
import { DAGAutomationGraph } from "components/DAGGraph";
import { InputList } from "components/Inputs/InputList";
import { InputTextView } from "components/Inputs/InputTextView";
import { ControlButton } from "react-flow-renderer";

interface Props {
  automation?: AutomationData;
  dims: DAGDims;
  onUpdate: (auto: AutomationData) => void;
  tagDB: TagDB;
}
export const AutomationEditor: FC<Props> = ({
  dims,
  automation: propsAutos,
  onUpdate: propsOnUpdate,
  tagDB,
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
          metadata={state.data.metadata}
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
              <div className="id">{state.data.metadata.id}</div>
              <InputTextView
                value={state.data.metadata.alias ?? ""}
                placeholder="Name"
                onChange={(alias) =>
                  updateMetadata(
                    {
                      ...state.data.metadata,
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
                id: state.data.metadata.mode,
                label: "",
              }}
              onChange={({ id }) =>
                updateMetadata(
                  {
                    ...state.data.metadata,
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
              value={state.data.metadata.description ?? ""}
              placeholder="Description"
              onChange={(description) =>
                updateMetadata(
                  {
                    ...state.data.metadata,
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
          <Button
            className={"automation-editor--flow-wrapper--toolbar--save-btn"}
            onClick={save}
            disabled={state.status !== "changed"}
          >
            Save <CheckMarkIcon color="#bf4" />
          </Button>
        </div>
        <DAGAutomationGraph
          sequence={state.data.sequence}
          trigger={state.data.trigger}
          condition={state.data.condition}
          onSequenceUpdate={updateSequence}
          onTriggerUpdate={updateTrigger}
          onConditionUpdate={updateCondition}
          isFlipped={flipped}
          additionalControls={
            <ControlButton onClick={() => setInfoBox(!infoBoxOpen)}>
              <ModeEditOutlineTwoToneIcon />
            </ControlButton>
          }
        />
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

  const makeSave =
    <K extends keyof EditorData>(k: K) =>
    (d: EditorData[K]) => {
      const newData = {
        ...data,
        [k]: d,
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
      <InputYaml
        label="Metadata"
        value={data.metadata}
        onChange={makeSave("metadata")}
      />
      <InputYaml label="Tags" value={data.tags} onChange={makeSave("tags")} />
      <InputYaml
        label="Trigger"
        value={data.trigger}
        onChange={makeSave("trigger")}
      />
      <InputYaml
        label="Condition"
        value={data.condition}
        onChange={makeSave("condition")}
      />
      <InputYaml
        label="Actions"
        value={data.sequence}
        onChange={makeSave("sequence")}
      />
      <Button disabled={failures.length > 0} onClick={() => props.onSave(data)}>
        Save
      </Button>
    </div>
  );
};
