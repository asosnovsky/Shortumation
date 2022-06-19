import "./InputYaml.css";
import * as yaml from "js-yaml";
import { useEffect, useState, ReactNode } from "react";

import CodeMirror from "@uiw/react-codemirror";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { FormHelperText, IconButton, InputAdornment } from "@mui/material";
import { Save } from "@mui/icons-material";

export interface Props<T extends {}> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  error?: JSX.Element | string;
  className?: string;
  placeholder?: any;
  required?: boolean;
  title?: string;
  helperText?: ReactNode;
  endAdornment?: ReactNode;
}
export default function InputYaml<T extends {}>({
  label,
  error: incmError,
  value = {} as any,
  onChange,
  className,
  placeholder,
  required,
  title,
  helperText,
  endAdornment,
}: Props<T>) {
  const [{ text, error, hasChanged }, setState] = useState<{
    text: string;
    error: undefined | JSX.Element | string;
    hasChanged: boolean;
  }>({
    text: yaml.dump(value),
    error: incmError,
    hasChanged: false,
  });
  const setText = (t: string) => {
    try {
      yaml.load(t);
      setState({ text: t, error: undefined, hasChanged: true });
    } catch (_) {
      setState({ text: t, error: "! Invalid Yaml !", hasChanged: true });
    }
  };
  const onSave = () => {
    if (!error && yaml.dump(value) !== text) {
      if (text) {
        onChange(yaml.load(text) as any);
      } else if (Array.isArray(value)) {
        onChange([] as any);
      } else {
        onChange({} as any);
      }
      setState({
        text,
        error,
        hasChanged: false,
      });
    }
  };
  useEffect(() => {
    setState({
      text: yaml.dump(value),
      error: incmError,
      hasChanged: false,
    });
  }, [value, incmError]);
  return (
    <FormControl
      className={["input-yaml", className ?? ""].join(" ")}
      fullWidth
      title={title}
    >
      <InputLabel>
        {label} {required ? "*" : ""}
      </InputLabel>
      <CodeMirror
        theme={"dark"}
        value={text}
        lang="yaml"
        onChange={setText}
        maxWidth="100%"
        width="100%"
        minWidth="100%"
      />
      <span className="input-yaml--placeholder">
        {!!text ? "" : placeholder}
      </span>
      <InputAdornment position="end">
        <IconButton
          disabled={!hasChanged}
          onClick={() => onSave()}
          title={!!error ? "Invalid YAML" : hasChanged ? "Save" : ""}
        >
          <Save
            color={hasChanged ? (!!error ? "error" : "success") : "disabled"}
          />
        </IconButton>
        {endAdornment}
      </InputAdornment>
      <FormHelperText variant="filled" error={!!error}>
        {error ? error : helperText}
      </FormHelperText>
    </FormControl>
  );
}
