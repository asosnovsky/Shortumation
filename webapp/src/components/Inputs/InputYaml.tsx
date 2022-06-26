import "./InputYaml.css";
import * as yaml from "js-yaml";
import { useEffect, useState, ReactNode } from "react";

import CodeMirror from "@uiw/react-codemirror";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import { Save } from "@mui/icons-material";
import { ButtonIcon } from "components/Icons/ButtonIcons";

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
  const originalText = yaml.dump(value);
  const [{ text, error }, setState] = useState<{
    text: string;
    error: undefined | JSX.Element | string;
  }>({
    text: originalText,
    error: incmError,
  });
  const hasChanged = text !== originalText;
  const setText = (t: string) => {
    try {
      yaml.load(t);
      setState({ text: t, error: undefined });
    } catch (_) {
      setState({ text: t, error: "! Invalid Yaml !" });
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
    }
  };
  useEffect(() => {
    setState({
      text: yaml.dump(value),
      error: incmError,
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
        minHeight="3.5em"
        minWidth="100%"
      />
      <span className="input-yaml--placeholder">
        {!!text ? "" : placeholder}
      </span>
      <InputAdornment position="end">
        <ButtonIcon
          disabled={!hasChanged}
          onClick={() => onSave()}
          title={!!error ? "Invalid YAML" : hasChanged ? "Save" : ""}
          icon={
            <Save
              color={hasChanged ? (!!error ? "error" : "success") : "disabled"}
            />
          }
        />
        {endAdornment}
      </InputAdornment>
      <FormHelperText variant="filled" error={!!error}>
        {error ? error : helperText}
      </FormHelperText>
    </FormControl>
  );
}
