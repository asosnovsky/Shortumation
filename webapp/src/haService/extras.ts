import { OptionsObject, useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { HASendMessage } from "./types";

export type DeviceTypeAction = {
  type: string;
  entity_id?: string;
  device_id?: string;
  domain: string;
};
export type DeviceTypeCapability = {
  extra_fields: Array<{
    name: string;
    required?: true;
    optional?: true;
    type: string;
  }>;
};
export const getDeviceExtraWsCalls = (callHA: HASendMessage) => {
  return {
    useDeviceActions(deviceId?: string) {
      const lastDeviceId = useRef<string | null>(null);
      const [options, setOptions] = useState<
        Array<{
          type: string;
          actions: DeviceTypeAction[];
        }>
      >([]);
      useEffect(() => {
        if (deviceId && lastDeviceId.current !== deviceId) {
          lastDeviceId.current = deviceId;
          callHA({
            type: "device_automation/action/list",
            device_id: deviceId,
          }).then((data: any[]) => {
            if (lastDeviceId.current === deviceId) {
              const dataMap: Record<string, DeviceTypeAction[]> = data.reduce(
                (all = {}, opt: any) => {
                  if (!all[opt.type]) {
                    all[opt.type] = [];
                  }
                  all[opt.type].push(opt);
                  return all;
                },
                {}
              );
              setOptions(
                Object.keys(dataMap).map((type) => ({
                  type,
                  actions: dataMap[type],
                }))
              );
            }
          });
        }
      }, [deviceId]);
      return options;
    },
    useDeviceCapalities(action?: DeviceTypeAction) {
      const snackbr = useSnackbar();
      const lastAction = useRef<string | null>(null);
      const [caps, setCaps] = useState<Partial<DeviceTypeCapability>>({});
      useEffect(() => {
        const currentAction = JSON.stringify(action);
        if (action && lastAction.current !== currentAction) {
          lastAction.current = currentAction;
          callHA({
            type: "device_automation/action/capabilities",
            action,
          })
            .then((data: DeviceTypeCapability) => {
              if (lastAction.current === currentAction) {
                setCaps(data);
              }
            })
            .catch((err) => {
              console.warn(err);
            });
        }
      }, [action]);
      return caps;
    },
  };
};
