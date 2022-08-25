import "./index.css";
import { FC } from "react";
import { useHAConnection } from "haService/connection";

export const VersionBox: FC = () => {
  const ha = useHAConnection();
  const version = process.env.REACT_APP_BUILD_VERSION ?? "n/a";

  return (
    <div className="version-box">
      version: {version} / HA Connection{"  "}
      <span id="circle" className={ha.status}>
        🟢
      </span>
    </div>
  );
};
