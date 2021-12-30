export interface API {
  makeCall: <Res = {}, Req = {}>(req: APIRequest<Req>) => Promise<APIResponse<Res>>; 
}
export type APIRequest<D> = {
  path: string;
  data: D;
};
export type APIResponse<D> = {
  ok: true;
  data: D;
} | {
  ok: false;
  error: string;
}

export const makeRemoteAPI = (baseURL: string): API => ({
    async makeCall (req) {
      const reply = await fetch(baseURL + "/" + req.path, {
        method: "POST",
        body: JSON.stringify(req.data),
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
