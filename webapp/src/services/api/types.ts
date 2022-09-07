import { AutomationData } from "types/automations";

export interface ListParams {
  offset: number;
  limit: number;
}
export type APIRequest<D> = {
  path: string;
  method?: "POST" | "DELETE" | "GET" | "PUT";
  data?: D;
};

export type APIResponse<D> =
  | {
      ok: true;
      data: D;
    }
  | {
      ok: false;
      error: string;
    };
export type Waitable<D> =
  | { ready: undefined }
  | ({ ready: true } & D)
  | {
      ready: false;
    };
export type ApiWaitable<D> = Waitable<APIResponse<D>>;
export interface ListData<D> {
  params: ListParams;
  totalItems: number;
  data: D[];
}

export interface ApiState {
  automations: ApiWaitable<ListData<AutomationData>>;
  userProfile: ApiWaitable<UserProfile>;
}

export type UserProfile = {
  theme: string;
  lang: string;
};
