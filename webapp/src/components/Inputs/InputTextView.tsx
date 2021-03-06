import "./InputTextView.css";

import { FC, PropsWithChildren, useState } from "react";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import TextField from "@mui/material/TextField";

export type InputTextViewProps = {
  className?: string;
  value: string;
  onChange: (t: string) => void;
  initialViewMode?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export const InputTextView: FC<PropsWithChildren<InputTextViewProps>> = (
  props
) => {
  const [viewMode, setViewMode] = useState(props.initialViewMode ?? true);
  const [text, setText] = useState(props.value);
  const className = [
    "input-text-view",
    viewMode ? "view" : "edit",
    props.className ?? "",
  ].join(" ");

  if (viewMode) {
    return (
      <div
        className={className}
        onClick={() => !props.disabled && setViewMode(false)}
      >
        {!!props.value ? (
          <span>{props.value}</span>
        ) : (
          <span className="input-text-view--placeholder">
            {props.placeholder}
          </span>
        )}
        {!props.disabled && (
          <ModeEditOutlineOutlinedIcon className="input-text-view--edit" />
        )}
        {props.children}
      </div>
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
