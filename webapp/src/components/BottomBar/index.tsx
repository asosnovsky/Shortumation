import "./index.css";
import { FC, useState } from "react";
import { useHAConnection } from "haService/connection";
import { Button } from "components/Inputs/Buttons/Button";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import { useLang } from "lang";
import { Modal } from "components/Modal";
import { UserProfileEditor, UserProfileProps } from "./UserProfile";

export type BottomBarProps = UserProfileProps;
export const BottomBar: FC<BottomBarProps> = ({ api }) => {
  const lang = useLang();
  const ha = useHAConnection();
  const version = process.env.REACT_APP_BUILD_VERSION ?? "n/a";
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="bottom-bar center row">
      <Modal open={isOpen}>
        <UserProfileEditor api={api} />
        <Button onClick={() => setOpen(false)}>{lang.get("CLOSE")}</Button>
      </Modal>
      <span id="connection">
        HA{" "}
        {ha.status === "loaded"
          ? lang.get("CONNECTED")
          : ha.status === "error"
          ? lang.get("FAILED")
          : lang.get("LOADING")}
        <b id="circle" className={ha.status}>
          🟢
        </b>
      </span>
      <span>version: {version}</span>
      <Button className="settings" onClick={() => setOpen(!isOpen)}>
        <SettingsSuggestOutlinedIcon />
        settings
      </Button>
    </div>
  );
};
