import "./CollectionNode.css";

import Add from "@mui/icons-material/Add";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { FC, PropsWithChildren } from "react";
import { SequenceNodeElement } from "../SequenceNode/SequenceNodeElement";
import { CollectionNodeProps } from "./types";
import {
  convertNodeTypeToSequenceNodeColor,
  useSequenceNodeColor,
} from "../SequenceNode/util";
import { prettyName } from "utils/formatting";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useLang } from "services/lang";

export const CollectionNodeElement: FC<PropsWithChildren<CollectionNodeProps>> =
  ({
    onAddNode,
    nodes,
    sequenceNode,
    height,
    width,
    flipped,
    collectionType,
    onDelete,
    title,
    children,
  }) => {
    const lang = useLang();
    const color = convertNodeTypeToSequenceNodeColor(collectionType);
    const nodeColor = useSequenceNodeColor(color);
    const confirm = useConfirm();
    const snackbr = useSnackbar();
    const trueTile = title ?? collectionType;

    return (
      <div
        className="collection-nodes--wrap"
        style={
          {
            "--node-color": nodeColor,
            "--node-height": `${height}px`,
            "--node-width": `${width}px`,
          } as any
        }
      >
        <div className="collection-nodes">
          {!!onDelete && (
            <ButtonIcon
              className="delete-icon"
              icon={<DeleteForeverIcon />}
              onClick={() => {
                confirm({
                  description: `Are you sure you want to delete ${trueTile}?`,
                })
                  .then(() => {
                    onDelete();
                    snackbr.enqueueSnackbar(lang.get("DELETED"), {
                      variant: "info",
                    });
                  })
                  .catch(() =>
                    snackbr.enqueueSnackbar(
                      lang.get("NOT_DELETED_THING", {
                        item: trueTile,
                      }),
                      {
                        variant: "info",
                      }
                    )
                  );
              }}
              borderless
              color="secondary"
            />
          )}
          <span className="collection-nodes--title">
            {prettyName(collectionType)}s
          </span>
          <div className="collection-nodes--inner">
            {nodes.map((n, i) => (
              <SequenceNodeElement
                key={i}
                color={color}
                flipped={flipped}
                {...n}
                {...sequenceNode}
              />
            ))}
          </div>
          <ButtonIcon className="add" icon={<Add />} onClick={onAddNode} />
          {children}
          <span className="collection-nodes--total">
            {nodes.length} node{nodes.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    );
  };
