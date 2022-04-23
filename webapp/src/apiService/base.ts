import { APIRequest, APIResponse } from './types';

export interface API {
  makeCall: <Res = any, Req = any>(req: APIRequest<Req>) => Promise<APIResponse<Res>>;
}
export const makeRemoteAPI = (baseURL: string): API => ({
  async makeCall({
    path,
    method = "POST",
    data = {}
  }) {
    try {
      const reply = await fetch(baseURL + path, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
      let response: APIResponse<any>;
      if (reply.status === 200) {
        response = {
          ok: true,
          data: await reply.json(),
        }
      } else {
        response = {
          ok: false,
          error: await reply.text(),
        }
        console.error(response)
      }
      return response
    } catch (err) {
      console.error(err)
      let error = String(err)

      if (err instanceof Error) {
        error += ` ${err.stack}`
      }

      return {
        ok: false,
        error,
      }
    }
  }
})
