import { API } from "./base";
import { UserProfile } from "./types";
import { USER_PROFILE_ROOT } from "./paths";

export const makeProfileAPI = (api: API) => ({
  async get() {
    const data = await api.makeCall<UserProfile>({
      path: USER_PROFILE_ROOT,
    });
    return data;
  },
  async update(data: UserProfile) {
    return await api.makeCall({
      method: "PUT",
      path: USER_PROFILE_ROOT,
      data,
    });
  },
});

export type UserProfileAPI = ReturnType<typeof makeProfileAPI>;
