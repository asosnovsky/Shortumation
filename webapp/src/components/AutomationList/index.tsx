import "./index.css";
import "./index.mobile.css";
import { AutomationEditor } from "components/AutomationEditor";
import { FC, ReactNode, useState, useRef, useEffect } from "react";
import { AutomationData } from "types/automations";
import { defaultAutomation } from "utils/defaults";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { ApiService } from "apiService/core";
import { AutomationListBox } from "./AutomationListBox";
import useWindowSize from "utils/useWindowSize";
import { makeTagDB } from "./TagDB";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { useCookies } from "react-cookie";
import { useHA } from "haService";
import { ArrowBack } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { DAGDims } from "components/DAGGraph/elements/types";
import { ListData, ListParams } from "apiService/types";

interface AutomationListParams {
  automations: ListData<AutomationData>;
  onUpdate: (i: number, auto: AutomationData) => void;
  onAdd: (auto: AutomationData) => void;
  onRemove: (i: number) => void;
  onLoadMore: (p: ListParams) => void;
  dims: DAGDims;
  children?: ReactNode;
}

export const useAutomationListState = () => {
  const [
    cookies,
    setCookies,
    // eslint-disable-next-line
    _,
  ] = useCookies(["alCurrent"]);
  let initialCurrent = 0;
  try {
    initialCurrent = Number(cookies.alCurrent ?? "0");
  } catch (_) {}

  const [hideList, setHideList] = useState(false);
  const [current, setCurrent] = useState(initialCurrent);

  return {
    hideList,
    setHideList,
    current,
    setCurrent(i: number) {
      setCurrent(i);
      setCookies("alCurrent", String(i));
    },
  };
};

export const AutomationList: FC<AutomationListParams> = ({
  automations,
  onLoadMore,
  onUpdate,
  onAdd,
  onRemove,
  dims,
  children,
}) => {
  // state
  const snackbr = useSnackbar();
  const { hideList, setHideList, current, setCurrent } =
    useAutomationListState();
  const { isMobile } = useWindowSize();
  const firstRender = useRef(true);
  // alias
  const currentAuto =
    automations.data.length > 0
      ? automations.data[current - automations.params.offset]
      : null;
  const tagDB = makeTagDB(automations.data);
  // effect
  useEffect(() => {
    if (firstRender.current) {
      snackbr.enqueueSnackbar("Saved.", { variant: "info" });
    }
    firstRender.current = true;
    // eslint-disable-next-line
  }, [automations]);
  // render
  return (
    <div
      className={["automation-list--root", isMobile ? "mobile" : ""].join(" ")}
    >
      <div
        className={["automation-list--list", hideList ? "hide" : "show"].join(
          " "
        )}
      >
        <AutomationListBox
          automations={automations}
          onUpdate={(a, i) => onUpdate(i, a)}
          onAdd={() => {
            onAdd(defaultAutomation(String(Date.now())));
            setCurrent(automations.data.length);
            if (isMobile) {
              setHideList(true);
            }
          }}
          onSelectAutomation={(i) => {
            setCurrent(i);
            if (isMobile) {
              setHideList(true);
            }
          }}
          onLoadMore={onLoadMore}
          selected={current}
          onRemove={onRemove}
          tagsDB={tagDB}
        />
        <ButtonIcon
          onClick={() => setHideList(!hideList)}
          className="automation-list--list-hide"
          icon={<ArrowBack />}
        />
      </div>
      <div className="automation-list--viewer">
        {currentAuto ? (
          <AutomationEditor
            automation={currentAuto}
            onUpdate={(a) => onUpdate(current, a)}
            dims={{
              ...dims,
              flipped: isMobile,
            }}
            tagDB={tagDB}
          />
        ) : (
          <></>
        )}
      </div>
      {children}
    </div>
  );
};

interface ConnectedAutomationListParams {
  dims: DAGDims;
  api: ApiService;
}
export const ConnectedAutomationList: FC<ConnectedAutomationListParams> = ({
  api: {
    state: { automations },
    ...methods
  },
  dims,
}) => {
  const { reloadAutomations } = useHA();
  const removeAutomation = async (args: any) => {
    const resp = await methods.removeAutomation(args);
    await reloadAutomations();
    return resp;
  };
  const updateAutomation = async (args: any) => {
    const resp = await methods.updateAutomation(args);
    await reloadAutomations();
    return resp;
  };
  if (!automations.ready) {
    return (
      <div className="automation-list--root loading">
        <LinearProgress />
        <div className="automation-list--circle-loader">
          <CircularProgress />
        </div>
      </div>
    );
  }
  if (!automations.ok) {
    return <span>Error {automations.error}</span>;
  }
  return (
    <AutomationList
      dims={dims}
      automations={automations.data}
      onLoadMore={() => {}}
      onAdd={(auto) =>
        updateAutomation({ auto, index: automations.data.totalItems + 1 })
      }
      onRemove={(index) => removeAutomation({ index })}
      onUpdate={(index, auto) => updateAutomation({ index, auto })}
    />
  );
};
