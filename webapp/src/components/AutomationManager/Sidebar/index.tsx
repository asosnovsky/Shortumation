import "./index.css";
import "./index.mobile.css";

import { FC, useState } from "react";

import ArrowIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

import InputText from "components/Inputs/Base/InputText";
import InputMultiSelect from "components/Inputs/InputMultiSelect";

import { ListBoxGroup } from "../ListBoxGroup";
import { filterAutomations } from "./helpers";
import { TagDB } from "../TagDB";
import { convertGroupingToItems, makeGrouping } from "../automationGrouper";
import {
  AutomationManagerAuto,
  AutomationManagerAutoUpdatable,
} from "../types";
import { Button } from "components/Inputs/Buttons/Button";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { useLang } from "services/lang";

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
  onRun: (eid: string) => void;
};
export const AutomationManagerSidebar: FC<AutomationManagerSidebarProps> = ({
  automations,
  tagsDB,
  onAutomationAdd,
  selectedAutomationId,
  onSelectedAutomationId,
  ...events
}) => {
  const langStore = useLang();
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
    convertGroupingToItems(i, automations, grouping, (aid, t) => ({
      ...t,
      isSelected: aid === selectedAutomationId,
      isModified: tagsDB.isModified(aid),
    }))
  );

  return (
    <div
      className={[
        "automation-manager--sidebar",
        isHidden ? "hidden" : "shown",
      ].join(" ")}
    >
      <div className="automation-manager--sidebar-box--nav">
        <InputText
          label={langStore.get("SEARCH")}
          value={searchText}
          onChange={setSearchText}
        />
        <InputMultiSelect
          label={langStore.get("TAGS")}
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
          {langStore.get("ADD")}
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
