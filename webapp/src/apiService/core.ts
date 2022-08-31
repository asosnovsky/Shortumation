import { useEffect } from "react";
import {
  useDefaultApiState,
  makeReloadAutomations,
  makeProfileManager,
} from "./util";
import { AutomationAPI } from "./automations";
import { UserProfileAPI } from "./profile";

export type ApiService = ReturnType<typeof useAPIService>;
export const useAPIService = (
  automationAPI: AutomationAPI,
  userProfileAPI: UserProfileAPI
) => {
  // state
  const [state, setState] = useDefaultApiState();
  const autoManager = makeReloadAutomations(automationAPI, state, setState);
  const userProfileManager = makeProfileManager(
    userProfileAPI,
    state,
    setState
  );

  // initial load of autos
  useEffect(() => {
    autoManager.reload();
    userProfileManager.reload();
    // eslint-disable-next-line
  }, []);

  return {
    state: {
      ...state,
      get theme(): "dark" | "light" {
        if (state.userProfile.ready && state.userProfile.ok) {
          if (["dark", "light"].includes(state.userProfile.data.theme)) {
            return state.userProfile.data.theme as any;
          }
        }
        return "dark";
      },
    },
    removeAutomation: autoManager.wrapCall(automationAPI.remove),
    updateAutomation: autoManager.wrapCall(automationAPI.update),
    createAutomation: autoManager.wrapCall(automationAPI.create),
    updateTags: autoManager.wrapCall(automationAPI.updateTags),
    setProfile: userProfileManager.update,
  };
};
