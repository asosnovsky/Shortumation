import { useEffect } from "react";
import { useDefaultApiState, makeReloadAutomations } from "./util";
import { AutomationAPI } from "./automations";

export type ApiService = ReturnType<typeof useAPIService>;
export const useAPIService = (automationAPI: AutomationAPI) => {
  // state
  const [state, setState] = useDefaultApiState();
  const { reload, wrapCall } = makeReloadAutomations(
    automationAPI,
    state,
    setState
  );

  // initial load of autos
  useEffect(() => {
    reload();
    // eslint-disable-next-line
  }, []);

  return {
    state,
    removeAutomation: wrapCall(automationAPI.remove),
    updateAutomation: wrapCall(automationAPI.update),
    updateTags: wrapCall(automationAPI.updateTags),
  };
};
