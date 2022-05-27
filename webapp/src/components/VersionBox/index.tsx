import "./index.css";
import { FC } from "react";

export const VersionBox: FC = () => {
    const version = process.env.REACT_APP_BUILD_VERSION ?? "n/a";
    return <div className="version-box">
        version: {version}
    </div>
}