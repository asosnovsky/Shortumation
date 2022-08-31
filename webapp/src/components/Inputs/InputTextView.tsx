import "./InputTextView.css";

import { FC, PropsWithChildren, useState } from "react";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useLang } from "lang";

export type InputTextViewProps = {
  className?: string;
  value: string;
  onChange: (t: string) => void;
  initialViewMode?: boolean;
  placeholder?: string;
  disabled?: boolean;
  borderless?: boolean;
  titleSlug?: string;
  titleParams?: Record<string, string>;
};

export const InputTextView: FC<PropsWithChildren<InputTextViewProps>> = (
  props
) => {
  const langStore = useLang();
  const [viewMode, setViewMode] = useState(props.initialViewMode ?? true);
  const [text, setText] = useState(props.value);
  const className = [
    "input-text-view",
    viewMode ? "view" : "edit",
    props.className ?? "",
  ].join(" ");

  if (viewMode) {
    return (
      <Tooltip
        title={
          props.titleSlug
            ? langStore.get(props.titleSlug, props.titleParams)
            : ""
        }
        describeChild
      >
        <div
          className={className}
          onClick={() => !props.disabled && setViewMode(false)}
        >
          {!!props.value ? (
            <div className="input-text-view--text text-ellipsis">
              <span>{props.value}</span>
            </div>
          ) : (
            <div className="input-text-view--text input-text-view--placeholder text-ellipsis">
              <span>{props.placeholder}</span>
            </div>
          )}
          {!props.disabled && (
            <ModeEditOutlineOutlinedIcon className="input-text-view--edit" />
          )}
          {props.children}
        </div>
      </Tooltip>
    );
  } else {
    return (
      <TextField
        className={className}
        placeholder={props.placeholder}
        variant="filled"
        value={text}
        onChange={(e) => setText(e.target.value)}
        InputProps={{
          endAdornment: (
            <>
              <CheckCircleOutlineOutlinedIcon
                onClick={() => {
                  setViewMode(true);
                  props.onChange(text);
                }}
              />
              {props.children}
            </>
          ),
        }}
      />
    );
  }
};
