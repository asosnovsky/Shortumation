import "./index.css";
import { AutomationEditor } from "components/AutomationEditor";
import { FC, useState } from "react";
import { AutomationData } from "types/automations";
import { DAGBoardElmDims } from 'components/DAGSvgs/DAGBoard';
import { defaultAutomation } from '../../utils/defaults';
import { ArrowIcon } from "components/Icons";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { ApiService } from "apiService/core";
import { AutomationListBox } from "./AutomationListBox";


interface AutomationListParams {
  automations: AutomationData[];
  onUpdate: (i: number, auto: AutomationData) => void;
  onAdd: (auto: AutomationData) => void;
  onRemove: (i: number) => void;
  dims: DAGBoardElmDims;
}

export const AutomationList: FC<AutomationListParams> = ({
  automations,
  onUpdate,
  onAdd,
  onRemove,
  dims,
  children,
}) => {
  // state
  const [hideList, setHideList] = useState(false);
  const [current, setCurrent] = useState(0);
  // alias
  const currentAuto = automations.length > 0 ? automations[current] : null;
  const automationListListCls = "automation-list--list" + (hideList ? " hide" : " show")
  // render
  return <div className="automation-list--root">
    <div className={automationListListCls}>
      <AutomationListBox
        automations={automations}
        onAdd={() => {
          onAdd(defaultAutomation(`shortu-${automations.length}`));
          setCurrent(automations.length)
        }}
        onSelectAutomation={setCurrent}
        onRemove={onRemove}
      />
      <ButtonIcon
        onClick={() => setHideList(!hideList)}
        className="automation-list--list-hide"
      >
        {ArrowIcon}
      </ButtonIcon>
    </div>
    <div className="automation-list--viewer">
      {currentAuto ? <AutomationEditor
        automation={currentAuto}
        onUpdate={a => onUpdate(current, a)}
        dims={dims}
      /> : <></>}
    </div>
    {children}
  </div>
}

interface ConnectedAutmationListParams {
  dims: DAGBoardElmDims;
  api: ApiService;
}
export const ConnectedAutmationList: FC<ConnectedAutmationListParams> = ({
  api: {
    state: {
      automations,
    },
    removeAutomation,
    updateAutomation,
  },
  dims
}) => {
  if (!automations.ready) {
    return <span>Loading...</span>
  }
  if (!automations.ok) {
    return <span>Error {automations.error}</span>
  }
  return <AutomationList
    dims={dims}
    automations={automations.data.data}
    onAdd={auto => updateAutomation({ auto, index: automations.data.totalItems + 1 })}
    onRemove={index => removeAutomation({ index })}
    onUpdate={(index, auto) => updateAutomation({ index, auto })}
  />
}
