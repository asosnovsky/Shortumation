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
};

export type AutomationManagerItem = {
  title: string;
  isSelected: boolean;
} & (
  | {
      type: "group";
      data: Array<AutomationManagerItem>;
    }
  | {
      type: "items";
      data: Array<AutomationManagerAuto & { isSelected: boolean }>;
    }
);
