export type AutomationManagerAutoUpdatable = {
  title: string;
  description: string;
  state: "on" | "off" | string;
};
export type AutomationManagerAuto = AutomationManagerAutoUpdatable & {
  id: string;
  entityId: string;
  tags: Record<string, string>;
  issue?: string;
  isNew?: boolean;
  source_file: string;
  source_file_type: string;
  configuration_key: string;
};
export type AutomationManagerAutoItem = AutomationManagerAuto & {
  flags: AutomationManagerItemFlags;
};
export type AutomationManagerItemFlags = {
  isSelected: boolean;
  isModified: boolean;
};
export type AutomationManagerItem = {
  title: string;
  flags: AutomationManagerItemFlags;
} & (
  | {
      type: "group";
      data: Array<AutomationManagerItem>;
    }
  | {
      type: "items";
      data: Array<AutomationManagerAutoItem>;
    }
);
