import { APIRequest, APIResponse } from "./types";

export interface API {
  makeCall: <Res = any, Req = any>(req: APIRequest<Req>) => Promise<APIResponse<Res>>; 
}
export const makeRemoteAPI = (baseURL: string): API => ({
  async makeCall({
      path,
      method = "POST",
      data={}
    }) {
      const reply = await fetch(baseURL + "/" + path, {
        method,
        body: JSON.stringify(data),
      });
      if (reply.status === 200) {
        return {
          ok: true,
          data: await reply.json(),
        }
      }
      return {
        ok: false,
        error: await reply.text(),
      }
    }
})
