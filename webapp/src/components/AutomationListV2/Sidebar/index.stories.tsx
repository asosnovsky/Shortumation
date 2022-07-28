import "styles/root.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { AutomationListSidebar } from ".";
import { makeTagDB } from "../TagDB";
import { useState } from "react";
import { AutomationListAuto } from "../types";

export default {
  title: "App/AutomationList/Sidebar",
  component: AutomationListSidebar,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {},
} as ComponentMeta<typeof AutomationListSidebar>;

const Template: ComponentStory<typeof AutomationListSidebar> = (args) => {
  const [automations, setAutomations] = useState(args.automations);
  return (
    <Page>
      <AutomationListSidebar
        tagsDB={makeTagDB(automations)}
        automations={automations}
        onAutomationDelete={(aid) => {
          args.onAutomationDelete(aid);
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
        onTagUpdate={(tags, aid) => {
          args.onTagUpdate(tags, aid);
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
              isSelected: true,
              state: "on",
            },
          ]);
        }}
      />
    </Page>
  );
};

const make = (automations: AutomationListAuto[]) => {
  const Basic = Template.bind({});
  Basic.args = {
    ...Basic.args,
    automations,
  };
  return Basic;
};
const makeAuto = (data: Partial<AutomationListAuto>): AutomationListAuto => ({
  id: String(Date.now()),
  entityId: `automation.${Date.now()}`,
  title: "",
  description: "",
  state: "on",
  isSelected: false,
  tags: {},
  ...data,
});

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
]);
