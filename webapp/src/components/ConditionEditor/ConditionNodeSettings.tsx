import "./ConditionNodeSettings.css";
import "./ConditionNodeSettings.mobile.css";

import { ButtonIcon, ButtonIconProps } from "components/Icons/ButtonIcons";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import CodeOffOutlinedIcon from "@mui/icons-material/CodeOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/Save";
import EditOffIcon from "@mui/icons-material/EditOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import useWindowSize from "utils/useWindowSize";
import { FC } from "react";
import { SpeedDial } from "components/SpeedDial";

export type ConditionNodeSettingsProps = {
  mode: ConditionNodeViewMode;
  onModeSwitch: (m: ConditionNodeViewMode) => void;
  isEdited: boolean;
  disableDelete: boolean;
  onDelete?: () => void;
  onSave: () => void;
};
export type ConditionNodeViewMode = "edit" | "yaml" | "view";
export const ConditionNodeSettings: FC<ConditionNodeSettingsProps> = (
  props
) => {
  // state
  const { isMobile } = useWindowSize();

  //   alias
  const showDelete = !props.disableDelete && !!props.onDelete;
  const createModeSwitch = (m: ConditionNodeViewMode) => () => {
    if (props.mode === m) {
      props.onModeSwitch("view");
    } else {
      props.onModeSwitch(m);
    }
  };
  const buttons: Array<ButtonIconProps> = [
    {
      color: "success",
      onClick: createModeSwitch("edit"),
      icon: props.mode === "edit" ? <EditOffIcon /> : <EditOutlinedIcon />,
    },
    {
      icon:
        props.mode === "yaml" ? <CodeOffOutlinedIcon /> : <CodeOutlinedIcon />,
      onClick: createModeSwitch("yaml"),
      color: "info",
    },
    {
      color: "success",
      icon: <SaveIcon />,
      disabled: !props.isEdited,
      onClick: props.onSave,
    },
  ];
  if (showDelete) {
    buttons.push({
      color: "error",
      icon: <DeleteForeverIcon />,
      onClick: props.onDelete,
    });
  }
  // render
  if (isMobile) {
    return (
      <div
        className={[
          "condition-node--settings mobile",
          props.isEdited ? "edited" : "",
        ].join(" ")}
      >
        <SpeedDial
          icon={
            <ButtonIcon
              icon={<SettingsApplicationsIcon />}
              color={props.isEdited ? "success" : "default"}
            />
          }
          direction="column"
        >
          {buttons.map((opt, i) => (
            <ButtonIcon key={i} {...opt} />
          ))}
        </SpeedDial>
      </div>
    );
  } else {
    return (
      <div className="condition-node--settings--wrap">
        <div className="condition-node--settings--icons">
          {buttons.map((opt, i) => (
            <ButtonIcon key={i} {...opt} />
          ))}
        </div>
      </div>
    );
  }
};
