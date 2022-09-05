import "./Tags.css";

import { FC, ReactNode, useState } from "react";

import DeleteIcon from "@mui/icons-material/ClearTwoTone";
import EditIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";

import { cleanUpUndefined } from "utils/helpers";
import { Modal } from "components/Modal";
import { Button } from "components/Inputs/Buttons/Button";
import InputAutoText from "components/Inputs/InputAutoText";

import { TagDB } from "../TagDB";
import { useLang } from "services/lang";

export type TagsProps = {
  automationId: string;
  tagsDB: TagDB;
};

export type TagModalState =
  | {
      open: false;
    }
  | {
      open: true;
      tag: [string, string];
      isNew: boolean;
    };

export const Tags: FC<TagsProps> = ({ automationId, tagsDB }) => {
  const langStore = useLang();
  const [modalState, setModal] = useState<TagModalState>({ open: false });
  const tags = tagsDB.getTags(automationId, true);
  const onUpdate = (t: Record<string, string>) =>
    tagsDB.update(automationId, t);

  let innerModal: ReactNode = <></>;
  if (modalState.open) {
    const validTag =
      modalState.tag[0].trim().length > 0 &&
      modalState.tag[1].trim().length > 0;
    innerModal = (
      <div className="metadatabox--tags--modal">
        <InputAutoText
          className="name"
          options={tagsDB.getTagNames(Object.keys(tags))}
          label={langStore.get("TAG_NAME")}
          value={modalState.tag[0]}
          onChange={(v) =>
            setModal({
              ...modalState,
              tag: [v ?? "", modalState.tag[1]],
            })
          }
        />
        <InputAutoText
          className="value"
          options={tagsDB.getTagValues(modalState.tag[0])}
          label={langStore.get("TAG_VALUE")}
          value={modalState.tag[1]}
          onChange={(v) =>
            setModal({
              ...modalState,
              tag: [modalState.tag[0], v ?? ""],
            })
          }
        />
        <div className="buttons">
          <Button onClick={() => setModal({ open: false })} color="info">
            {langStore.get("CLOSE")}
          </Button>
          <Button
            disabled={!validTag}
            onClick={() => {
              onUpdate({
                ...tags,
                [modalState.tag[0]]: modalState.tag[1],
              });
              setModal({ open: false });
            }}
            color="success"
          >
            {modalState.isNew ? langStore.get("CREATE") : langStore.get("SAVE")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "metadatabox--tags",
        tagsDB.isModified(automationId) ? "modified" : "",
      ].join(" ")}
    >
      <Modal open={modalState.open}>{innerModal}</Modal>
      {Object.entries(tags).map(([tagName, tagValue]) => (
        <div key={tagName} className="tag">
          <DeleteIcon
            onClick={() =>
              onUpdate(
                cleanUpUndefined({
                  ...tags,
                  [tagName]: undefined,
                })
              )
            }
            className="delete-tag"
          />
          <div
            className="inner"
            onClick={() =>
              setModal({
                open: true,
                isNew: false,
                tag: [tagName, tagValue],
              })
            }
          >
            <b>{tagName}: </b>
            <span>{tagValue}</span>
          </div>
          <EditIcon
            className="edit-icon"
            onClick={() =>
              setModal({
                open: true,
                isNew: false,
                tag: [tagName, tagValue],
              })
            }
          />
        </div>
      ))}
      <div className="buttons">
        <span
          className="tag-add"
          onClick={() =>
            setModal({
              open: true,
              isNew: true,
              tag: ["", ""],
            })
          }
        >
          +
        </span>
        {tagsDB.isModified(automationId) && (
          <SaveIcon
            className="tag-save"
            onClick={() => tagsDB.save(automationId)}
          />
        )}
      </div>
    </div>
  );
};
