import * as yaml from "js-yaml";
import { useEffect, useState } from "react";
import { useDelayEffect } from 'utils/useDelay';

import CodeMirror from '@uiw/react-codemirror';
import InputWrapper from "./InputWrapper";


export interface Props<T extends {}> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  error?: JSX.Element | string,
}
export default function InputYaml<T>({
  label,
  error: incmError,
  value = {} as any,
  onChange,
}: Props<T>) {
  const [{ text, error }, setState] = useState<{
    text: string,
    error: undefined | JSX.Element | string,
  }>({
    text: yaml.dump(value),
    error: incmError,
  });
  const setText = (t: string) => {
    try {
      yaml.load(t)
      setState({ text: t, error: undefined })
    } catch (_) {
      setState({ text: t, error: "! Invalid Yaml !" })
    }
  }
  useEffect(() => {
    setState({
      text: yaml.dump(value),
      error: incmError,
    })
  }, [value, incmError])
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
  return <InputWrapper label={label} error={error}>
    <CodeMirror
      theme={"dark"}
      value={text}
      lang="yaml"
      onChange={setText}
    />
  </InputWrapper>
}
