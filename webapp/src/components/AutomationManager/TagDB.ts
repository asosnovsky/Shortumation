import { useEffect, useRef, useState } from "react";

type TagDBState = {
  original: Record<string, Record<string, string>>;
  changed: Record<string, Record<string, string>>;
};
export type TagDB = ReturnType<typeof useTagDB>;
export const useTagDB = (
  automations: Array<{
    id: string;
    tags: Record<string, string>;
  }>,
  onUpdate: (aid: string, tags: Record<string, string>) => void
) => {
  const lastAuto = useRef(JSON.stringify(automations));
  const [{ original, changed }, setState] = useState<TagDBState>({
    original: convertAutoListToMap(automations),
    changed: {},
  });
  const allTags = computeAllTags(original);
  const allTagNames = Object.keys(allTags);
  const isModified = Object.keys(changed).length > 0;
  useEffect(() => {
    const c = JSON.stringify(automations);
    if (lastAuto.current !== c) {
      lastAuto.current = c;
      setState({
        original: convertAutoListToMap(automations),
        changed: {},
      });
    }
  }, [automations, setState]);

  return {
    getTags(automationId: string, includeChanged: boolean = false) {
      if (includeChanged) {
        return changed[automationId] ?? original[automationId] ?? {};
      }
      return original[automationId] ?? {};
    },
    getTagNames(myTags: string[]): string[] {
      return allTagNames.filter((n) => !myTags.includes(n)).sort();
    },
    getTagValues(tagName: string): string[] {
      return allTags[tagName]
        ? Array.from(allTags[tagName].values()).sort()
        : [];
    },
    isModified(aid: string): boolean {
      return aid in changed;
    },
    update(aid: string, tags: Record<string, string>) {
      const update = JSON.stringify(tags);
      if (aid in changed) {
        if (update === JSON.stringify(changed[aid])) {
          return;
        }
      } else if (update === JSON.stringify(original[aid])) {
        return;
      }
      setState({
        changed: {
          ...changed,
          [aid]: tags,
        },
        original,
      });
    },
    save(aid: string | null) {
      if (isModified) {
        if (aid) {
          onUpdate(aid, changed[aid]);
        } else {
          for (const [aid, change] of Object.entries(changed)) {
            onUpdate(aid, change);
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
