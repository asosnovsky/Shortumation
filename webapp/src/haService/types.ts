import { MessageBase } from "home-assistant-js-websocket";
import { AutomationDeviceState } from "types/automations/common";

export type EntityRegisteryItem = {
  area_id: null | string;
  config_entry_id: null | string;
  device_id: null | string;
  disabled_by: "integration" | "user" | "config_entry" | string | null;
  entity_category: "diagnostic" | "config" | string | null;
  hidden_by: "integration" | "user" | string | null;
  entity_id: string;
  icon: null | string;
  name: null | string;
  platform: string;
};

export type DeviceRegistryItem = {
  id: string;
  name: string;
  name_by_user: string | null;
  manufacturer: string | null;
  entry_type: "service" | string | null;
  disabled_by: EntityRegisteryItem["disabled_by"];
  area_id: string | null;
};

export type HassDevices = Array<DeviceRegistryItem>;
export type HassEntitiesRegistry = Array<EntityRegisteryItem>;
export type HASendMessage = (sendMsg: MessageBase) => Promise<any>;

export type DeviceBaseType = AutomationDeviceState & {
  metadata: Record<string, any>;
} & Record<string, any>;
export type DeviceTypeAction = DeviceBaseType;
export type DeviceTriggerType = DeviceBaseType & {
  platform: string;
};
export type DeviceTypeCapability = {
  extra_fields: Array<{
    name: string;
    required?: true;
    type: string;
  }>;
};
