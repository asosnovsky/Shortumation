export type AutomationListAutoUpdatable = {
  title: string;
  description: string;
  state: "on" | "off" | string;
};
export type AutomationListAuto = AutomationListAutoUpdatable & {
  id: string;
  entityId: string;
  tags: Record<string, string>;
  issue?: string;
  isSelected: boolean;
};

export type AutomationListItem = {
  title: string;
  isSelected: boolean;
} & (
  | {
      type: "group";
      data: Array<AutomationListItem>;
    }
  | {
      type: "items";
      data: Array<AutomationListAuto>;
    }
);
