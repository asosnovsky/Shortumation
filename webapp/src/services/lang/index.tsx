import { useApiState } from "services/api";
import {
  FC,
  useEffect,
  useState,
  createContext,
  PropsWithChildren,
  useContext,
} from "react";
import { Waitable } from "../api/types";

const MISSING_TEXT = "<<MISSING TEXT -- {{langId}}>>";
const LOADING_TEXT = "...";

export type LangStore = {
  get(langId: string, replacements?: Record<string, string>): string;
};
const LangContext = createContext<Waitable<LangStore>>({
  ready: false,
});

export const useLang = (): LangStore & { ready: boolean } => {
  const langState = useContext(LangContext);

  if (langState.ready) {
    return langState;
  }
  return {
    ready: false,
    get() {
      return LOADING_TEXT;
    },
  };
};

export const LangProvider: FC<PropsWithChildren> = ({ children }) => {
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

  const methods = {
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

  const value: Waitable<LangStore> =
    langStore === null && langEngStore === null
      ? { ready: false }
      : {
          ready: true,
          ...methods,
        };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};
