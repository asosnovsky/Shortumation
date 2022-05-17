import * as yaml from "js-yaml";
import { useState } from "react";
import InputTextArea from "./InputTextArea";
import { useDelayedFunction, useDelayEffect } from 'utils/useDelay';

export interface Props<T extends {}> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  resizable?: boolean;
}
export default function InputYaml<T>({
  label,
  value = {} as any,
  onChange,
  resizable,
}: Props<T>) {
  const [{ text, error }, setState] = useState<{
    text: string,
    error: undefined | string,
  }>({
    text: yaml.dump(value),
    error: undefined
  });
  const setText = (t: string) => {
    try {
      setState({ text: t, error: undefined })
    } catch (_) {
      setState({ text: t, error: "! Invalid Yaml !" })
    }
  }
  useDelayEffect(() => {
    if (!error && (yaml.dump(value) !== text)) {
      if (text) {
        onChange(yaml.load(text) as any)
      } else if (Array.isArray(value)) {
        onChange([] as any)
      } else {
        onChange({} as any)
      }
    }
  }, [text], 1000)
  return <InputTextArea
    error={error}
    label={label}
    value={text}
    onChange={setText}
    resizable={resizable}
  />
}
