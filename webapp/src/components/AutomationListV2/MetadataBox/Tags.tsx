import { FC } from "react";

import DeleteIcon from "@mui/icons-material/ClearTwoTone";

import { cleanUpUndefined } from "utils/helpers";

export type TagsProps = {
  tags: Record<string, string>;
  onUpdate: (t: Record<string, string>) => void;
};

export const Tags: FC<TagsProps> = ({ tags, onUpdate }) => {
  return (
    <div className="metadatabox--tags">
      {Object.entries(tags).map(([tagName, tagValue]) => (
        <span key={tagName} className="tag">
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
          <b>{tagName}</b>: {tagValue}
        </span>
      ))}
      <span className="tag-add" onClick={() => {}}>
        +
      </span>
    </div>
  );
};
