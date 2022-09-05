export interface TypedHassService {
  name?: string;
  description: string;
  fields: Fields;
  target?: Targets | null | undefined;
}

export type Fields = Record<string, FieldData>;
export interface Targets {
  device?: TargetData;
  entity?: TargetData;
}
export interface TargetData {
  domain?: string;
  integration?: string;
}

export interface FieldData {
  name?: string | undefined;
  description: string;
  required?: boolean;
  example?: any;
  selector?: FieldSelector;
  advanced?: boolean;
  default?: any;
}

export interface FieldSelector {
  text?: SelectorText | null;
  select?: SelectorSelect;
  number?: SelectorNumber;
  boolean?: null;
  object?: null;
  theme?: null;
  addon?: null;
  entity?: TargetData;
  icon?: null;
  color_rgb?: null;
  color_temp?: SelectorColorTemp | null;
  time?: null;
}

export interface SelectorColorTemp {
  min_mireds: number;
  max_mireds: number;
}

export interface SelectorNumber {
  min: number;
  max: number;
  unit_of_measurement?: string;
  mode?: "box";
  step?: number;
}

interface SelectorSelect {
  options: OptionElement[];
}

type OptionElement = OptionClass | string;

interface OptionClass {
  label: string;
  value: string;
}

export interface SelectorText {
  multiline: boolean;
}
