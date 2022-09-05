import { useState } from "react";
import { ApiState } from "./types";
import { AutomationAPI } from "./automations";
import { UserProfileAPI } from "./profile";
import { UserProfile } from "services/api/types";

export const useDefaultApiState = () =>
  useState<ApiState>({
    automations: { ready: undefined },
    userProfile: { ready: undefined },
  });

export const makeReloadAutomations = (
  automationAPI: AutomationAPI,
  state: ApiState,
  setState: (s: ApiState) => void
) => {
  const reload = async () => {
    let params = { offset: 0, limit: 10000 };
    if (state.automations.ready && state.automations.ok) {
      params = state.automations.data.params;
    }
    const resp = await automationAPI.list(params);
    setState({
      ...state,
      automations: {
        ready: true,
        ...resp,
      },
    });
  };
  const wrapCall = <Call extends (a: any) => Promise<any>>(fcn: Call) => {
    return async (args: Parameters<Call>[0]) => {
      const resp = await fcn(args);
      await reload();
      return resp as ReturnType<Call>;
    };
  };
  return {
    reload,
    wrapCall,
  };
};

export const makeProfileManager = (
  userProfileAPI: UserProfileAPI,
  state: ApiState,
  setState: (s: ApiState) => void
) => {
  const reload = () =>
    userProfileAPI
      .get()
      .then((data) => {
        setState({
          ...state,
          userProfile: {
            ready: true,
            ...data,
          },
        });
      })
      .catch((error) =>
        setState({
          ...state,
          userProfile: {
            ready: true,
            ok: false,
            error: JSON.stringify(error),
          },
        })
      );

  return {
    reload,
    update: (data: UserProfile) =>
      userProfileAPI
        .update(data)
        .then(() => reload())
        .catch((err) =>
          setState({
            ...state,
            userProfile: {
              ok: false,
              error: String(err),
              ready: true,
            },
          })
        ),
  };
};
