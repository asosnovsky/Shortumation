import "./index.css";
import { FC, useState } from "react";
import { useHAConnection } from "services/ha/connection";
import { Button } from "components/Inputs/Buttons/Button";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import { useLang } from "services/lang";
import { Modal } from "components/Modal";
import { UserProfileEditor, UserProfileProps } from "./UserProfile";
import { useVersioner } from "services/versioner";

export type BottomBarProps = UserProfileProps;
export const BottomBar: FC<BottomBarProps> = ({ api }) => {
  const lang = useLang();
  const ha = useHAConnection();
  const versionMgr = useVersioner();
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="bottom-bar center row">
      <Modal open={isOpen} className="center column">
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
      <span>version: {versionMgr.current}</span>
      <Button className="settings" onClick={() => setOpen(!isOpen)}>
        <SettingsSuggestOutlinedIcon />
        {lang.get("USER_PRERENCES")}
      </Button>
    </div>
  );
};
