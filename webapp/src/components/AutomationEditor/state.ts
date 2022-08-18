import { useState, useEffect } from "react";
import {
  AutomationData,
  AutomationMetadata,
  BareAutomationData,
} from "types/automations";
import * as v from "types/validators/autmation";
import { getFailures, MiniFailure } from "types/validators/helper";

export type EditorData = ReturnType<typeof genEditorData>;
export type EditorState =
  | {
      status: "unchanged";
      data: EditorData;
    }
  | {
      status: "changed" | "saving";
      previous: EditorData[];
      data: EditorData;
    }
  | {
      status: "loading";
    }
  | {
      status: "invalid";
      failures: MiniFailure[];
      data: EditorData;
    };
export type EditorStatus = EditorState["status"];

export const useAutomatioEditorState = (
  automation: AutomationData | BareAutomationData | undefined,
  onSave: (a: AutomationData | BareAutomationData) => void
) => {
  // state
  const [state, update] = useState<EditorState>({
    status: "loading",
  });

  // helpers
  const validate = (data: any) => {
    return getFailures(data, v.AutomationData);
  };
  const makeUpdate =
    <K extends keyof EditorData, D extends EditorData[K]>(name: K) =>
    (data: D) =>
      (state.status === "changed" || state.status === "unchanged") &&
      update({
        status: "changed",
        previous:
          state.status === "unchanged"
            ? [state.data]
            : state.previous.concat([state.data]),
        data: {
          ...state.data,
          [name]: data,
        },
      });

  const saveAndUpdate = (data: EditorData) => {
    if (state.status === "changed") {
      const cleanData = {
        ...data,
        tags: data.tags.reduce(
          (all, [tagName, tagValue]) => ({
            ...all,
            [tagName.trim()]: tagValue.trim(),
          }),
          {}
        ),
      };
      update({
        status: "saving",
        previous: state.previous,
        data,
      });
      onSave(cleanData);
    }
  };

  // pub methods
  const methods = {
    validate,
    updateTrigger: makeUpdate("trigger"),
    updateSequence: makeUpdate("action"),
    updateCondition: makeUpdate("condition"),
    saveAndUpdate,
    updateMetadata: (
      metadata: AutomationMetadata,
      tags: Array<[string, string]>
    ) => {
      if (state.status === "changed" || state.status === "unchanged") {
        update({
          status: "changed",
          previous:
            state.status === "changed"
              ? state.previous.concat([state.data])
              : [state.data],
          data: {
            ...state.data,
            tags,
            ...metadata,
          },
        });
      }
    },
    save: () => {
      if (state.status !== "loading") {
        saveAndUpdate(state.data);
      }
    },
    undo: () => {
      if (state.status === "changed") {
        if (state.previous.length === 1) {
          update({
            status: "unchanged",
            data: state.previous[0],
          });
        } else {
          update({
            status: "changed",
            data: state.previous[state.previous.length - 1],
            previous: state.previous.slice(0, state.previous.length - 1),
          });
        }
      }
    },
    get state() {
      return state;
    },
  };

  // effects
  useEffect(() => {
    if (automation) {
      const failures = validate(automation);
      if (failures) {
        update({
          status: "invalid",
          failures,
          data: genEditorData(automation),
        });
      } else {
        update({
          status: "unchanged",
          data: genEditorData(automation),
        });
      }
    }
  }, [automation]);

  return methods;
};

const genEditorData = (automation: AutomationData | BareAutomationData) => {
  const { tags: rawTags, trigger, action, condition, ...metadata } = automation;

  const tags: [string, string][] = Object.keys(rawTags).map((tagName) => [
    tagName,
    rawTags[tagName],
  ]);

  return {
    ...metadata,
    trigger,
    action,
    condition,
    tags,
  };
};
