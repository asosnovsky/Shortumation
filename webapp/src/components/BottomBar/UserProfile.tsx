import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import { ApiService } from "services/api/core";
import { UserProfile } from "services/api/types";
import { InputList } from "components/Inputs/InputList";
import { useLang } from "services/lang";
import { FC, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import InputBoolean from "components/Inputs/Base/InputBoolean";

export type UserProfileProps = {
  api: ApiService;
};
export const UserProfileEditor: FC<UserProfileProps> = ({ api }) => {
  const [saving, setIsSaving] = useState(false);
  const profile = api.state.userProfile;
  const lang = useLang();
  if (!profile.ready) {
    return (
      <div className="user-profile">
        <Skeleton />
      </div>
    );
  }
  if (!profile.ok) {
    return (
      <div className="user-profile">
        <Alert color="error">{JSON.stringify(profile.error)}</Alert>
      </div>
    );
  }
  const update =
    <K extends keyof UserProfile, D extends UserProfile[K]>(key: K) =>
    (data: D) => {
      if (profile.ready) {
        setIsSaving(true);
        api
          .setProfile({
            ...profile.data,
            [key]: data,
          })
          .then(() => {
            setIsSaving(false);
          });
      }
    };
  const updateFlag =
    <K extends keyof UserProfile["flags"], D extends UserProfile["flags"][K]>(
      key: K
    ) =>
    (data: D) => {
      if (profile.ready) {
        setIsSaving(true);
        api
          .setProfile({
            ...profile.data,
            flags: {
              ...profile.data.flags,
              [key]: data,
            },
          })
          .then(() => {
            setIsSaving(false);
          });
      }
    };
  return (
    <div className="user-profile">
      <InputList
        label={lang.get("THEME")}
        options={["dark", "light"]}
        current={profile.data.theme}
        onChange={update("theme")}
      />
      <InputList
        label={lang.get("LANGUAGE")}
        options={["eng", "fra", "ita"]}
        current={profile.data.lang}
        onChange={update("lang")}
      />
      <InputBoolean
        label={lang.get("FLIPP_GRAPH")}
        value={profile.data.flags.flipped ?? false}
        onChange={updateFlag("flipped")}
      />
      <InputBoolean
        label={lang.get("NODES_ROW")}
        value={profile.data.flags.useNodesRow ?? true}
        onChange={updateFlag("useNodesRow")}
      />
      {saving && <LinearProgress />}
    </div>
  );
};
