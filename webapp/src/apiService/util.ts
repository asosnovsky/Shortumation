import { useState } from "react";
import { ApiState } from "./types";
import { AutomationAPI } from "./automations";

export const useDefaultApiState = () =>
  useState<ApiState>({
    automations: { ready: false },
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
