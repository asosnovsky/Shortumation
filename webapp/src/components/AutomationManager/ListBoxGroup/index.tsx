import "./index.css";

import { FC, useState } from "react";
import { MetadataBox } from "../MetadataBox";
import {
  AutomationManagerAutoUpdatable,
  AutomationManagerItem,
} from "../types";
import { TagDB } from "../TagDB";

export type ListBoxGroupProps = AutomationManagerItem & {
  onAutomationUpdate: (
    a: AutomationManagerAutoUpdatable,
    aid: string,
    eid: string
  ) => void;
  onAutomationDelete: (aid: string, eid: string) => void;
  onSelect: (aid: string) => void;
  initialOpenState?: boolean;
  tagsDB: TagDB;
};
export const ListBoxGroup: FC<ListBoxGroupProps> = ({
  title,
  type,
  data,
  flags,
  initialOpenState,
  tagsDB,
  ...events
}) => {
  const [open, setOpen] = useState(initialOpenState ?? false);

  const openIcon = !open ? "⊕" : "⊖";
  const totalAutomations = countAutomations({
    title,
    type,
    data,
  } as any);

  return (
    <div
      className={[
        "automation-manager--list-box-group",
        flags.isSelected ? "selected" : "",
        flags.isModified ? "modified" : "",
      ].join(" ")}
    >
      <div
        onClick={() => setOpen(!open)}
        className="automation-manager--list-box-group--title"
      >
        <b>{title}</b> <span className="icon">{openIcon}</span> (
        {totalAutomations} automation
        {totalAutomations === 1 ? "" : "s"})
      </div>
      <div
        className={[
          "automation-manager--list-box-group--list",
          open ? "open" : "close",
        ].join(" ")}
      >
        {type === "items"
          ? data.map((auto, i) => (
              <MetadataBox
                key={`${i}-${auto.id}`}
                {...auto}
                tagsDB={tagsDB}
                onDelete={() =>
                  events.onAutomationDelete(auto.id, auto.entityId)
                }
                isSelected={auto.flags.isSelected}
                onSelect={() => events.onSelect(auto.id)}
                onDescriptionUpdate={(description) =>
                  events.onAutomationUpdate(
                    {
                      ...auto,
                      description,
                    },
                    auto.id,
                    auto.entityId
                  )
                }
                onTitleUpdate={(title) =>
                  events.onAutomationUpdate(
                    {
                      ...auto,
                      title,
                    },
                    auto.id,
                    auto.entityId
                  )
                }
                onStateUpdate={(state) =>
                  events.onAutomationUpdate(
                    {
                      ...auto,
                      state,
                    },
                    auto.id,
                    auto.entityId
                  )
                }
              />
            ))
          : data.map((group, i) => (
              <ListBoxGroup {...events} {...group} tagsDB={tagsDB} key={i} />
            ))}
      </div>
    </div>
  );
};

const countAutomations = (item: AutomationManagerItem): number => {
  if (item.type === "items") {
    return item.data.length;
  } else {
    return item.data.reduce((total = 0, n) => total + countAutomations(n), 0);
  }
};
