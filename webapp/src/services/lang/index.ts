import { useApiState } from "services/api";
import { useEffect, useState } from "react";

const MISSING_TEXT = "<<MISSING TEXT -- {{langId}}>>";
const LOADING_TEXT = "...";

export type LangStore = ReturnType<typeof useLang>;
export const useLang = () => {
  const apiState = useApiState();
  const [langStore, setLangStore] =
    useState<Record<string, string> | null>(null);
  const [langEngStore, setLangEngStore] =
    useState<Record<string, string> | null>(null);

  useEffect(() => {
    import("./eng.json").then((data) => {
      setLangEngStore(data.default);
    });
  }, []);
  useEffect(() => {
    if (apiState.userProfile.ready && apiState.userProfile.ok) {
      import(`./${apiState.userProfile.data.lang}.json`).then((data) => {
        setLangStore(data.default);
      });
    }
  }, [apiState.userProfile]);

  const updateParams = (
    textTemplate: string,
    replacements: Record<string, string> = {}
  ) => {
    let text = textTemplate;
    Object.keys(replacements).forEach((k) => {
      const v = replacements[k];
      text = text.replace(`{{${k}}}`, v);
    });
    return text;
  };

  return {
    get: (langId: string, replacements: Record<string, string> = {}) => {
      let out = LOADING_TEXT;
      if (langStore !== null) {
        out =
          langStore[langId.toLocaleUpperCase()] ??
          `<<${langStore.MISSING_TEXT}>>` ??
          MISSING_TEXT;
      } else if (langEngStore !== null) {
        out =
          langEngStore[langId.toLocaleUpperCase()] ??
          `<<${langEngStore.MISSING_TEXT}>>` ??
          MISSING_TEXT;
      }
      return updateParams(out, { ...replacements, langId });
    },
  };
};
