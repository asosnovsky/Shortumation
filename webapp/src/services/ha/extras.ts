import { BaseOption } from "components/Inputs/AutoComplete/InputAutoComplete";
import { MessageBase } from "home-assistant-js-websocket";
import { useEffect, useRef, useState } from "react";
import { prettyName } from "utils/formatting";
import {
  DeviceConditionType,
  DeviceTriggerType,
  DeviceTypeAction,
  DeviceTypeCapability,
  HASendMessage,
} from "./types";

export const makeCreateUseThing = (callHA: HASendMessage) =>
  function <Args, HAData, STData>(
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

export const getDeviceExtraWsCalls = (callHA: HASendMessage) => {
  const createUseThing = makeCreateUseThing(callHA);
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
    useDeviceTriggerCapalities: createUseThing<
      DeviceTypeAction,
      DeviceTypeCapability,
      Partial<DeviceTypeCapability>
    >(
      (trigger) => ({
        type: "device_automation/trigger/capabilities",
        trigger,
      }),
      (data) => data,
      {}
    ),
    useDeviceTriggers: createUseThing<
      { deviceId: string },
      DeviceTriggerType[],
      Record<string, BaseOption<{ data: DeviceTriggerType[] }>>
    >(
      ({ deviceId }) => ({
        type: "device_automation/trigger/list",
        device_id: deviceId,
      }),
      reduceDeviceThings,
      {}
    ),
    useDeviceConditionCapalities: createUseThing<
      DeviceTypeAction,
      DeviceTypeCapability,
      Partial<DeviceTypeCapability>
    >(
      (condition) => ({
        type: "device_automation/condition/capabilities",
        condition,
      }),
      (data) => data,
      {}
    ),
    useDeviceConditions: createUseThing<
      { deviceId: string },
      DeviceConditionType[],
      Record<string, BaseOption<{ data: DeviceConditionType[] }>>
    >(
      ({ deviceId }) => ({
        type: "device_automation/condition/list",
        device_id: deviceId,
      }),
      reduceDeviceThings,
      {}
    ),
  };
};
