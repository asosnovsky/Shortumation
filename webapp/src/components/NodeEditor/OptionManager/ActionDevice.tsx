import { DeviceEditor } from "components/DeviceEditor";
import { DeviceAction } from "types/automations/actions";
import { OptionManager } from "./OptionManager";
export const ActionDeviceState: OptionManager<DeviceAction> = {
  defaultState: () => ({
    alias: "",
    device_id: "",
  }),
  isReady: () => true,
  Component: ({ state, setState, ha }) => {
    const options = ha.deviceExtras.useDeviceActions(
      state.device_id
        ? {
            deviceId: state.device_id,
          }
        : undefined
    );
    const caps = ha.deviceExtras.useDeviceCapalities(
      state.device_id && state.type && state.domain ? (state as any) : undefined
    );
    return (
      <DeviceEditor
        state={state}
        setState={setState}
        options={options}
        caps={caps}
        type="action"
      />
    );
  },
};
