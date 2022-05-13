import { AutomationNode, AutomationNodeMapping } from "types/automations";

export interface MultiNodeEditorProps {
    sequence: AutomationNode[];
    allowedTypes: Array<keyof AutomationNodeMapping>;
    onClose?: () => void;
    onSave?: (n: AutomationNode[]) => void;
}
