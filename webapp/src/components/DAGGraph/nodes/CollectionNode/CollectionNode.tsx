import "./CollectionNode.css";

import Add from "@mui/icons-material/Add";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { FC } from "react";
import { SequenceNodeElement } from "../SequenceNode/SequenceNodeElement";
import { CollectionNodeProps } from "./types";
import { Handle, Position } from "react-flow-renderer";
import { useSequenceNodeColor } from "../SequenceNode/util";
import { prettyName } from "utils/formatting";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";

export const CollectionNode: FC<CollectionNodeProps> = ({
  onAddNode,
  nodes,
  sequenceNode,
  height,
  width,
  flipped,
  color,
  collectionType,
  onDelete,
  title,
}) => {
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
                  snackbr.enqueueSnackbar("Deleted.", {
                    variant: "info",
                  });
                })
                .catch(() =>
                  snackbr.enqueueSnackbar(`Did not delete ${trueTile}.`, {
                    variant: "info",
                  })
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
        <>
          <Handle
            id="default"
            key="source-def"
            type="source"
            position={flipped ? Position.Bottom : Position.Right}
          />
          <Handle
            id="head"
            key="source-head"
            type="source"
            position={flipped ? Position.Top : Position.Left}
          />
        </>
        <>
          <Handle
            id="default"
            key="target-def"
            type="target"
            position={flipped ? Position.Top : Position.Left}
          />
          <Handle
            id="side"
            key="target-side"
            type="target"
            position={!flipped ? Position.Right : Position.Left}
          />
          <Handle
            id="return"
            key="target-return"
            type="target"
            position={!flipped ? Position.Bottom : Position.Right}
          />
        </>
        <span className="collection-nodes--total">
          {nodes.length} node{nodes.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};
