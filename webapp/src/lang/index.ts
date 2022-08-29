import { useEffect, useState } from "react";

const MISSING_TEXT = "<<MISSING TEXT -- {{langId}}>>";
const LOADING_TEXT = "...";

export type LangStore = ReturnType<typeof useLang>;
export const useLang = () => {
  const [langStore, setLangStore] =
    useState<Record<string, string> | null>(null);
  const [langEngStore, setLangEngStore] =
    useState<Record<string, string> | null>(null);

  useEffect(() => {
    import("./eng.json").then((data) => {
      // setLangStore(data.default);
      setLangEngStore(data.default);
    });
    import("./eng.json").then((data) => {
      setLangStore(data.default);
    });
  }, []);

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
    get: (langId: string, replacements: Record<string, string> = {}) =>
      updateParams(
        langStore === null || langEngStore === null
          ? LOADING_TEXT
          : langStore[langId.toLocaleUpperCase()] ??
              langEngStore[langId.toLocaleUpperCase()] ??
              `<<${langStore.MISSING_TEXT}>>` ??
              MISSING_TEXT,
        { ...replacements, langId }
      ),
  };
};
