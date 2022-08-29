import { useEffect } from "react";
import { useDefaultApiState, makeReloadAutomations } from "./util";
import { AutomationAPI } from "./automations";
import { UserProfileAPI } from "./profile";

export type ApiService = ReturnType<typeof useAPIService>;
export const useAPIService = (
  automationAPI: AutomationAPI,
  userProfileAPI: UserProfileAPI
) => {
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
    createAutomation: wrapCall(automationAPI.create),
    updateTags: wrapCall(automationAPI.updateTags),
    getProfile: wrapCall(userProfileAPI.get),
    setProfile: wrapCall(userProfileAPI.update),
  };
};
