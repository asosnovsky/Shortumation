import "./InputTextView.css";

import { FC, useState } from "react";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import TextField from "@mui/material/TextField";

export type InputTextViewProps = {
  className?: string;
  value: string;
  onChange: (t: string) => void;
  initialViewMode?: boolean;
  placeholder?: string;
};

export const InputTextView: FC<InputTextViewProps> = (props) => {
  const [viewMode, setViewMode] = useState(props.initialViewMode ?? true);

  const className = [
    "input-text-view",
    viewMode ? "view" : "edit",
    props.className ?? "",
  ].join(" ");

  if (viewMode) {
    return (
      <div className={className} onClick={() => setViewMode(false)}>
        {!!props.value ? (
          props.value
        ) : (
          <span className="input-text-view--placeholder">
            {props.placeholder}
          </span>
        )}
        <ModeEditOutlineOutlinedIcon className="input-text-view--edit" />
      </div>
    );
  } else {
    return (
      <TextField
        className={className}
        placeholder={props.placeholder}
        variant="filled"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <CheckCircleOutlineOutlinedIcon onClick={() => setViewMode(true)} />
          ),
        }}
      />
    );
  }
};
