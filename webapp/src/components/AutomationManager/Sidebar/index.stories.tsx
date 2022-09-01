import { AutomationManagerSidebar } from ".";
import { useTagDB } from "../TagDB";
import { useState } from "react";
import { AutomationManagerAuto } from "../types";

import { makeStory } from "devUtils";

const story = makeStory({
  meta: {
    title: "App/AutomationManager/Sidebar",
  },
  Component: AutomationManagerSidebar,
  BaseTemplate: (args) => {
    const [automations, setAutomations] = useState(args.automations);
    const [selectedAutomationId, setSelAutoId] = useState(
      args.selectedAutomationId
    );
    const onTagUpdate = (tags: Record<string, string>, aid: string) => {
      const index = automations.findIndex(({ id }) => id === aid);
      if (index >= 0) {
        setAutomations([
          ...automations.slice(0, index),
          {
            ...automations[index],
            tags,
          },
          ...automations.slice(index + 1),
        ]);
      }
    };
    return (
      <AutomationManagerSidebar
        selectedAutomationId={selectedAutomationId}
        tagsDB={useTagDB(automations, (a, t) => onTagUpdate(t, a))}
        automations={automations}
        onRun={args.onRun}
        onSelectedAutomationId={(aid) => {
          args.onSelectedAutomationId(aid);
          setSelAutoId(aid);
        }}
        onAutomationDelete={(aid, eid) => {
          args.onAutomationDelete(aid, eid);
          setAutomations(automations.filter(({ id }) => id !== aid));
        }}
        onAutomationUpdate={(a, aid, eid) => {
          args.onAutomationUpdate(a, aid, eid);
          const index = automations.findIndex(({ id }) => id === aid);
          if (index >= 0) {
            setAutomations([
              ...automations.slice(0, index),
              {
                ...automations[index],
                ...a,
              },
              ...automations.slice(index + 1),
            ]);
          }
        }}
        onAutomationAdd={() => {
          args.onAutomationAdd();
          const id = String(Date.now());
          setAutomations([
            ...automations,
            {
              id,
              description: "",
              title: "new",
              tags: {},
              entityId: "automation." + id,
              state: "on",
              source_file: "automation.yaml",
              source_file_type: "list",
              configuration_key: ["automation"],
              readonly: false,
            },
          ]);
          setSelAutoId(id);
        }}
      />
    );
  },
});

export default story.componentMeta;

const make = (automations: AutomationManagerAuto[]) =>
  story.make({
    automations,
  });
const makeAuto = (
  data: Partial<AutomationManagerAuto>
): AutomationManagerAuto => {
  const id = `${Date.now()}_${Math.random().toString(26).slice(3, 6)}`;
  return {
    id,
    entityId: `automation.${id}`,
    title: "",
    description: "",
    state: "on",
    tags: {},
    source_file: "automation.yaml",
    source_file_type: "list",
    configuration_key: ["automation"],
    readonly: false,
    ...data,
  };
};

export const Empty = make([]);
export const Basic = make([
  makeAuto({ title: "example 1" }),
  makeAuto({ title: "example 2", state: "off" }),
  makeAuto({ title: "example 3", state: "invalid" }),
  makeAuto({ title: "example 4", issue: "I have an issue!" }),
]);
export const Tagged = make([
  makeAuto({ title: "example 1", tags: { room: "bathroom", floor: "1" } }),
  makeAuto({ title: "example 2", tags: { type: "routine" } }),
  makeAuto({
    title: "example 3",
    tags: { room: "living room", type: "climate" },
  }),
  makeAuto({
    title: "example 4",
    tags: { room: "bedroom", floor: "2", type: "button" },
  }),
  makeAuto({
    title: "example 5",
    tags: { room: "bedroom", floor: "2", type: "routine", mode: "party" },
  }),
]);
