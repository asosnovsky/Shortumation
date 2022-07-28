import { useEffect, useRef, useState } from "react";
export type TagDB = ReturnType<typeof useTagDB>;
export const useTagDB = (
  automations: Array<{
    id: string;
    tags: Record<string, string>;
  }>,
  onUpdate: (aid: string, tags: Record<string, string>) => void
) => {
  const lastAuto = useRef(JSON.stringify(automations));
  const [{ automationTags, changed }, setState] = useState({
    automationTags: convertAutoListToMap(automations),
    changed: new Set<string>(),
  });
  const allTags = computeAllTags(automationTags);
  const allTagNames = Object.keys(allTags);
  const isModified = changed.size > 0;

  useEffect(() => {
    const c = JSON.stringify(automations);
    if (lastAuto.current !== c) {
      lastAuto.current = c;
      console.log("updating...");

      setState({
        automationTags: convertAutoListToMap(automations),
        changed: new Set(),
      });
    }
  }, [automations, setState]);

  return {
    getTags(automationId: string) {
      return automationTags[automationId] ?? {};
    },
    getTagNames(myTags: string[]): string[] {
      return allTagNames.filter((n) => !myTags.includes(n)).sort();
    },
    getTagValues(tagName: string): string[] {
      return allTags[tagName]
        ? Array.from(allTags[tagName].values()).sort()
        : [];
    },
    isModified(aid: string) {
      return changed.has(aid);
    },
    update(aid: string, tags: Record<string, string>) {
      if (JSON.stringify(tags) !== JSON.stringify(automationTags[aid])) {
        setState({
          changed: changed.add(aid),
          automationTags: {
            ...automationTags,
            [aid]: tags,
          },
        });
      }
    },
    save(aid: string | null) {
      if (isModified) {
        if (aid) {
          onUpdate(aid, automationTags[aid]);
        } else {
          for (const aid of changed.values()) {
            onUpdate(aid, automationTags[aid]);
          }
        }
      }
    },
  };
};

const convertAutoListToMap = (
  automations: Array<{
    id: string;
    tags: Record<string, string>;
  }>
) => {
  const automationTags: Record<string, Record<string, string>> = {};
  automations.forEach(({ id, tags }) => {
    automationTags[id] = tags;
  });
  return automationTags;
};

const computeAllTags = (
  automations: Record<string, Record<string, string>>
) => {
  const allTags: Record<string, Set<string>> = {};
  Object.values(automations).forEach((tags) => {
    Object.keys(tags).forEach((tagName) => {
      const tagValue = tags[tagName];
      if (!allTags[tagName]) {
        allTags[tagName] = new Set();
      }
      allTags[tagName].add(tagValue);
    });
  });
  return allTags;
};
