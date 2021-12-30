import { useRef } from 'react';
import { AutomationData } from 'types/automations';
import { API } from './base';
import { AUTOMTAION_LIST, AUTOMTAION_ROOT } from './paths';


export const useMockAPI = (
  initialAutos: AutomationData[] = [],
  makeRef = useRef,
): API => {
  const automationsRef = makeRef(initialAutos);
  return {
    async makeCall({
      path,
      method = "POST",
      data = {}
    }) {
      console.debug("[[mockCall]]", method, path, data);
      if (path === AUTOMTAION_LIST) {
        return {
          ok: true,
          data: JSON.parse(JSON.stringify({
            totalItems: automationsRef.current.length,
            params: { offset: 0, limit: 100 },
            data: automationsRef.current,
          }))
        } as any
      }
      if (path === AUTOMTAION_ROOT) {
        if (method === 'POST') {
          const { index, data: auto } = data as any;
          if (index >= automationsRef.current.length) {
            automationsRef.current = [...automationsRef.current, auto];
          } else {
            automationsRef.current = [
              ...automationsRef.current.slice(0, index),
              auto,
              ...automationsRef.current.slice(index + 1)
            ];
          } 
          return {
            ok: true,
            data: {}
          }
        } else if (method === "DELETE") {
          const { index } = data as any;
          automationsRef.current = [
            ...automationsRef.current.slice(0, index),
            ...automationsRef.current.slice(index + 1)
          ];
          return {
            ok: true,
            data: {}
          }
        }
      }
      return {
        ok: false,
        error: "PATH NOT FOUND " + method + ": " + path,
      }
    }
  }
}
