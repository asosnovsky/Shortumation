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
  platform: "device";
};
export type DeviceConditionType = DeviceBaseType & {
  condition: "device";
};
export type DeviceTypeCapability = {
  extra_fields: Array<HaFormSchema>;
};

export type HaFormSchema =
  | HaFormConstantSchema
  | HaFormStringSchema
  | HaFormIntegerSchema
  | HaFormFloatSchema
  | HaFormBooleanSchema
  | HaFormSelectSchema
  | HaFormMultiSelectSchema
  | HaFormTimeSchema
  | HaFormGridSchema;

export interface HaFormBaseSchema {
  name: string;
  default?: any;
  required?: boolean;
  description?: {
    suffix?: string;
    suggested_value?: any;
  };
}

export interface HaFormGridSchema extends HaFormBaseSchema {
  type: "grid";
  name: "";
  column_min_width?: string;
  schema: HaFormSchema[];
}

export interface HaFormConstantSchema extends HaFormBaseSchema {
  type: "constant";
  value?: string;
}

export interface HaFormIntegerSchema extends HaFormBaseSchema {
  type: "integer";
  valueMin?: number;
  valueMax?: number;
}

export interface HaFormSelectSchema extends HaFormBaseSchema {
  type: "select";
  options: Array<[string, string]>;
}

export interface HaFormMultiSelectSchema extends HaFormBaseSchema {
  type: "multi_select";
  options: Record<string, string> | string[] | Array<[string, string]>;
}

export interface HaFormFloatSchema extends HaFormBaseSchema {
  type: "float";
}

export interface HaFormStringSchema extends HaFormBaseSchema {
  type: "string";
  format?: string;
}

export interface HaFormBooleanSchema extends HaFormBaseSchema {
  type: "boolean";
}

export interface HaFormTimeSchema extends HaFormBaseSchema {
  type: "positive_time_period_dict";
}

export interface EntitySource {
  domain: string;
  custom_component: boolean;
  source: "config_entry" | "platform_config";
  config_entry?: string;
}
