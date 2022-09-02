import { APIRequest, APIResponse } from "./types";

export interface API {
  makeCall: <Res = any, Req = any>(
    req: APIRequest<Req>
  ) => Promise<APIResponse<Res>>;
}
export const makeRemoteAPI = (baseURL: string): API => ({
  async makeCall({ path, method = "POST", data = {} }) {
    try {
      const payload: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (method !== "GET") {
        payload["body"] = JSON.stringify(data);
      }
      const reply = await fetch(baseURL + path, payload);
      let response: APIResponse<any>;
      if (reply.status === 200) {
        response = {
          ok: true,
          data: await reply.json(),
        };
      } else {
        response = {
          ok: false,
          error: await reply.text(),
        };
        console.error(response);
      }
      return response;
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        error: `Server error: ${method} ${path}`,
      };
    }
  },
});
