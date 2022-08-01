import "./index.css";
import "./index.mobile.css";

import { FC, useState } from "react";

import ArrowIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

import InputText from "components/Inputs/InputText";
import InputMultiSelect from "components/Inputs/InputMultiSelect";

import { ListBoxGroup } from "../ListBoxGroup";
import { filterAutomations } from "./helpers";
import { TagDB } from "../TagDB";
import { convertGroupingToItems, makeGrouping } from "../automationGrouper";
import {
  AutomationManagerAuto,
  AutomationManagerAutoUpdatable,
} from "../types";
import { Button } from "components/Inputs/Button";
import { ButtonIcon } from "components/Icons/ButtonIcons";

export type AutomationManagerSidebarProps = {
  tagsDB: TagDB;
  automations: AutomationManagerAuto[];
  selectedAutomationId: string | null;
  onAutomationUpdate: (
    a: AutomationManagerAutoUpdatable,
    aid: string,
    eid: string
  ) => void;
  onAutomationDelete: (aid: string, eid: string) => void;
  onAutomationAdd: () => void;
  onSelectedAutomationId: (aid: string) => void;
};
export const AutomationManagerSidebar: FC<AutomationManagerSidebarProps> = ({
  automations,
  tagsDB,
  onAutomationAdd,
  selectedAutomationId,
  onSelectedAutomationId,
  ...events
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedTagIdx, setSelectedTagIdx] = useState<number[]>([]);
  const [isHidden, setHidden] = useState(false);

  const tags = tagsDB.getTagNames([]);

  if (searchText.trim().length > 0) {
    automations = filterAutomations(
      automations,
      searchText.toLocaleLowerCase()
    );
  }

  const grouping = makeGrouping(
    automations,
    selectedTagIdx.map((i) => tags[i]),
    selectedAutomationId
  );

  const items = grouping.top.map((i) =>
    convertGroupingToItems(i, selectedAutomationId, automations, grouping)
  );

  return (
    <div
      className={[
        "automation-manager--sidebar",
        isHidden ? "hidden" : "shown",
      ].join(" ")}
    >
      <div className="automation-manager--sidebar-box--nav">
        <InputText label="Search" value={searchText} onChange={setSearchText} />
        <InputMultiSelect
          label="Tags"
          selected={selectedTagIdx}
          onChange={setSelectedTagIdx}
          options={tags}
          max={3}
        />
      </div>
      <div className="automation-manager--sidebar-box--list">
        {items.map((item, i) => (
          <ListBoxGroup
            {...item}
            key={i}
            onSelect={(id) => {
              onSelectedAutomationId(id);
              setHidden(true);
            }}
            {...events}
            tagsDB={tagsDB}
            initialOpenState={true}
          />
        ))}
      </div>
      <div className="automation-manager--sidebar-box--bottom-buttons">
        <Button
          onClick={() => {
            onAutomationAdd();
            setHidden(true);
          }}
          color="primary"
          className="add-btn"
        >
          Add
        </Button>
        <ButtonIcon
          className="hide-btn"
          color="secondary"
          icon={<ArrowIcon />}
          onClick={() => setHidden(!isHidden)}
        />
      </div>
    </div>
  );
};
