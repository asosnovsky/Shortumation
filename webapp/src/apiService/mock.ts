import { useRef } from "react";
import { AutomationData } from "types/automations";
import { API } from "./base";
import {
  AUTOMTAION_LIST,
  AUTOMTAION_ITEM,
  AUTOMTAION_ITEM_TAGS,
} from "./paths";

export const useMockAPI = (
  initialAutos: AutomationData[] = [],
  makeRef = useRef,
  returnErrors: boolean = false
): API => {
  const automationsRef = makeRef(initialAutos);
  return {
    async makeCall({ path, method = "POST", data = {} }) {
      if (returnErrors) {
        return {
          ok: false,
          error: "Test Error",
        };
      }
      // console.debug("[[mockCall]]", method, path, data);
      if (path === AUTOMTAION_LIST) {
        return {
          ok: true,
          data: JSON.parse(
            JSON.stringify({
              totalItems: automationsRef.current.length,
              params: { offset: 0, limit: 100 },
              data: automationsRef.current,
            })
          ),
        } as any;
      }
      if (path === AUTOMTAION_ITEM) {
        if (method === "POST") {
          const auto = data as AutomationData;
          const index = automationsRef.current.findIndex(
            ({ id }) => auto.id === id
          );
          if (index < 0) {
            automationsRef.current = [...automationsRef.current, auto];
          } else {
            automationsRef.current = [
              ...automationsRef.current.slice(0, index),
              auto,
              ...automationsRef.current.slice(index + 1),
            ];
          }
          return {
            ok: true,
            data: {},
          };
        } else if (method === "DELETE") {
          const auto = data as AutomationData;
          automationsRef.current = automationsRef.current.filter(
            ({ id }) => id !== auto.id
          );
          return {
            ok: true,
            data: {},
          };
        }
      }
      if (path === AUTOMTAION_ITEM_TAGS) {
        if (method === "POST") {
          const { automation_id, tags } = data as any;
          for (let i = 0; i < automationsRef.current.length; i++) {
            const auto = automationsRef.current[i];
            if (auto.id === automation_id) {
              automationsRef.current[i].tags = JSON.parse(JSON.stringify(tags));
              break;
            }
          }
          return {
            ok: true,
            data: {},
          };
        }
      }
      return {
        ok: false,
        error: "PATH NOT FOUND " + method + ": " + path,
      };
    },
  };
};
