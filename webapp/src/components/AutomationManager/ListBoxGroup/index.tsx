import "./index.css";

import { FC, useState } from "react";
import { MetadataBox } from "../MetadataBox";
import { AutomationListAutoUpdatable, AutomationListItem } from "../types";
import { TagDB } from "../TagDB";

export type ListBoxGroupProps = AutomationListItem & {
  onAutomationUpdate: (
    a: AutomationListAutoUpdatable,
    aid: string,
    eid: string
  ) => void;
  onAutomationDelete: (aid: string) => void;
  onSelect: (aid: string) => void;
  initialOpenState?: boolean;
  tagsDB: TagDB;
};
export const ListBoxGroup: FC<ListBoxGroupProps> = ({
  title,
  type,
  data,
  isSelected,
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
        isSelected ? "selected" : "",
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
          ? data.map((auto) => (
              <MetadataBox
                key={auto.id}
                {...auto}
                tagsDB={tagsDB}
                onDelete={() => events.onAutomationDelete(auto.id)}
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

const countAutomations = (item: AutomationListItem): number => {
  if (item.type === "items") {
    return item.data.length;
  } else {
    return item.data.reduce((total = 0, n) => total + countAutomations(n), 0);
  }
};
