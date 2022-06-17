import { BaseOption } from "components/Inputs/InputAutoComplete";
import { MessageBase } from "home-assistant-js-websocket";
import { useEffect, useRef, useState } from "react";
import { prettyName } from "utils/formatting";
import { HASendMessage } from "./types";

export type DeviceTypeAction = {
  type: string;
  subtype?: string;
  entity_id?: string;
  device_id?: string;
  domain: string;
};
export type DeviceTypeTrigger = {
  type: string;
  subtype?: string;
  platform: string;
  device_id: string;
  entity_id?: string;
  domain: string;
  metadata: Record<string, any>;
} & Record<string, any>;

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
  const reduceDeviceThings = function <
    Raw extends { type: string; subtype?: string; entity_id?: string }
  >(raw: Raw[]) {
    return raw.reduce<Record<string, BaseOption<{ data: Raw[] }>>>(
      (all, opt: Raw) => {
        const id = opt.type + (opt.subtype ?? "");
        if (!all[id]) {
          return {
            ...all,
            [id]: {
              id,
              label:
                prettyName(opt.type) + (opt.subtype ? ` ${opt.subtype}` : ""),
              data: [opt],
            },
          };
        } else {
          all[id].data.push(opt);
          return all;
        }
      },
      {}
    );
  };

  return {
    useDeviceActions: createUseThing<
      { deviceId: string },
      DeviceTypeAction[],
      Record<string, BaseOption<{ data: DeviceTypeAction[] }>>
    >(
      ({ deviceId }) => ({
        type: "device_automation/action/list",
        device_id: deviceId,
      }),
      reduceDeviceThings,
      {}
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
    useDeviceTriggers: createUseThing<
      { deviceId: string },
      DeviceTypeTrigger[],
      DeviceTypeTrigger[]
    >(
      ({ deviceId }) => ({
        type: "device_automation/trigger/list",
        device_id: deviceId,
      }),
      (data) => data,
      []
    ),
  };
};
