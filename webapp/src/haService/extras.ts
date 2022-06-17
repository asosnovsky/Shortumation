import { MessageBase } from "home-assistant-js-websocket";
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
  const createUseThing = function <Args, HAData, STData>(
    convertArgsToMessage: (a: Args) => MessageBase,
    transformHAData: (ha: HAData) => STData,
    defaultSTData: STData
  ) {
    return function useThis(args?: Args) {
      const lastThing = useRef<string | null>(null);
      const [stData, setStData] = useState<STData>(defaultSTData);
      useEffect(() => {
        const currentThing = JSON.stringify(args);
        if (args && currentThing && lastThing.current !== currentThing) {
          lastThing.current = currentThing;
          const msg = convertArgsToMessage(args);
          callHA(msg)
            .then((raw: HAData) => {
              if (lastThing.current === currentThing) {
                setStData(transformHAData(raw));
              }
            })
            .catch((error) => {
              console.warn({ msg, args, currentThing, error });
            });
        } else if (lastThing.current !== currentThing) {
          lastThing.current = currentThing;
          setStData(defaultSTData);
        }
      }, [args]);
      return stData;
    };
  };

  return {
    useDeviceActions: createUseThing<
      { deviceId: string },
      any[],
      Array<{
        type: string;
        actions: DeviceTypeAction[];
      }>
    >(
      ({ deviceId }) => ({
        type: "device_automation/action/list",
        device_id: deviceId,
      }),
      (data) => {
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
        return Object.keys(dataMap).map((type) => ({
          type,
          actions: dataMap[type],
        }));
      },
      []
    ),
    useDeviceCapalities: createUseThing<
      DeviceTypeAction,
      DeviceTypeCapability,
      Partial<DeviceTypeCapability>
    >(
      (action) => ({
        type: "device_automation/action/capabilities",
        action,
      }),
      (data) => data,
      {}
    ),
  };
};
