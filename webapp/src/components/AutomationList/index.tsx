import "./index.css";
import "./index.mobile.css";
import { AutomationEditor } from "components/AutomationEditor";
import { FC, ReactNode, useState } from "react";
import { AutomationData } from "types/automations";
import { defaultAutomation } from 'utils/defaults';
import { ArrowIcon } from "components/Icons";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { ApiService } from "apiService/core";
import { AutomationListBox } from "./AutomationListBox";
import { DAGAutomationFlowDims } from 'components/DAGFlow/types';
import useWindowSize from "utils/useWindowSize";
import { makeTagDB } from "./TagDB";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { useCookies } from 'react-cookie';


interface AutomationListParams {
  automations: AutomationData[];
  onUpdate: (i: number, auto: AutomationData) => void;
  onAdd: (auto: AutomationData) => void;
  onRemove: (i: number) => void;
  dims: DAGAutomationFlowDims;
  children?: ReactNode;
}

export const useAutomationListState = () => {
  const [cookies, setCookies, _] = useCookies(['alCurrent']);
  let initialCurrent = 0;
  try {
    initialCurrent = Number(cookies.alCurrent ?? '0');
    // eslint-disable-next-line
  } catch (_) { }

  const [hideList, setHideList] = useState(false);
  const [current, setCurrent] = useState(initialCurrent);

  return {
    hideList,
    setHideList,
    current,
    setCurrent(i: number) {
      setCurrent(i)
      setCookies('alCurrent', String(i))
    }
  }
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
  const { hideList, setHideList, current, setCurrent } = useAutomationListState();
  const { isMobile } = useWindowSize();
  // alias
  const currentAuto = automations.length > 0 ? automations[current] : null;
  const tagDB = makeTagDB(automations);
  // render
  return <div className={["automation-list--root", isMobile ? 'mobile' : ''].join(' ')}>
    <div className={["automation-list--list", hideList ? "hide" : "show"].join(' ')}>
      <AutomationListBox
        automations={automations}
        onAdd={() => {
          onAdd(defaultAutomation(String(Date.now())));
          setCurrent(automations.length)
        }}
        onSelectAutomation={i => {
          setCurrent(i);
          if (isMobile) {
            setHideList(true)
          }
        }}
        selected={current}
        onRemove={onRemove}
      />
      <ButtonIcon
        onClick={() => setHideList(!hideList)}
        className="automation-list--list-hide"
        Icon={ArrowIcon}
      />
    </div>
    <div className="automation-list--viewer">
      {currentAuto ? <AutomationEditor
        automation={currentAuto}
        onUpdate={a => onUpdate(current, a)}
        dims={{
          ...dims,
          flipped: isMobile
        }}
        tagDB={tagDB}
      /> : <></>}
    </div>
    {children}
  </div>
}

interface ConnectedAutomationListParams {
  dims: DAGAutomationFlowDims;
  api: ApiService;
}
export const ConnectedAutomationList: FC<ConnectedAutomationListParams> = ({
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
    return <div className="automation-list--root loading">
      <LinearProgress />
      <div className="automation-list--circle-loader">
        <CircularProgress />
      </div>
    </div>
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
