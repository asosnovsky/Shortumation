import { OptionManager } from "./OptionManager";
import { AutomationTriggerDevice } from "types/automations/triggers";
import { DeviceEditor } from "components/DeviceEditor";

export const TriggerDevice: OptionManager<AutomationTriggerDevice> = {
  defaultState: () => ({
    platform: "device",
    device_id: "",
    domain: "",
    type: "",
  }),
  isReady: () => true,
  Component: ({ state, setState, ha }) => {
    // state
    const triggers = ha.deviceExtras.useDeviceTriggers(
      state.device_id
        ? {
            deviceId: state.device_id,
          }
        : undefined
    );
    const caps = ha.deviceExtras.useDeviceTriggerCapalities(
      state.device_id && state.type && state.domain ? (state as any) : undefined
    );

    return (
      <DeviceEditor
        type="trigger"
        state={state}
        setState={(s) =>
          setState({
            platform: "device",
            device_id: "",
            domain: "",
            type: "",
            ...s,
          })
        }
        options={triggers}
        caps={caps}
      />
    );
  },
};
