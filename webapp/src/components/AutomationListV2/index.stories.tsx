import "styles/root.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { AutomationList } from ".";
import { createHAEntitiesState, useHAEntities } from "haService/HAEntities";
import { makeTagDB } from "./TagDB";
import { useConnectedApiService } from "apiService";
import { useMockHAEntities } from "haService/HAEntities.mock";
import { createMockAuto } from "utils/mocks";
import { useState } from "react";

export default {
  title: "App/AutomationList",
  component: AutomationList,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    title: "Example",
    description: "Cool!",
    state: "on",
    tags: {
      room: "main bedroom",
      routine: "night time",
    },
  },
} as ComponentMeta<typeof AutomationList>;

export const Loading: ComponentStory<typeof AutomationList> = (args) => {
  return (
    <Page>
      <AutomationList
        {...args}
        haEntites={useMockHAEntities({ loading: true })}
        tagsDB={makeTagDB([])}
        configAutomationMetadatas={[]}
      />
    </Page>
  );
};

export const Mocked: ComponentStory<typeof AutomationList> = (args) => {
  const [mockAutos, setAutos] = useState([
    createMockAuto({ room: "bedroom" }),
    createMockAuto({ room: "bathroom", type: "routine" }),
    createMockAuto({ type: "routine" }),
    createMockAuto(),
    createMockAuto({ type: "missing in ws" }),
  ]);
  const [mockEntitiesStates, setMES] = useState<Record<string, string>>({
    ...mockAutos.slice(0, 4).reduce((all, auto, i) => {
      const eid = `automation.number_${i}`;
      return {
        ...all,
        [eid]: i % 2 == 0 ? "on" : "off",
      };
    }, {}),
    "automation.number_not_in_config": "on",
  });
  const mockEntities = mockAutos.slice(0, 4).reduce((all, auto, i) => {
    const eid = `automation.number_${i}`;
    return {
      ...all,
      [eid]: {
        entity_id: eid,
        attributes: {
          id: auto.metadata.id,
        },
        state: mockEntitiesStates[eid] ?? "n/a",
      },
    };
  }, {});
  const haEntities = useMockHAEntities({
    loading: false,
    entities: {
      ...mockEntities,
      "automation.number_not_in_config": {
        entity_id: "automation.number_not_in_config",
        state: mockEntitiesStates["automation.number_not_in_config"] ?? "n/a",
        attributes: {
          id: "1235",
          friendly_name: "What am I?",
        },
      } as any,
    },
    entitySource: {},
  });
  return (
    <Page>
      <AutomationList
        haEntites={haEntities}
        tagsDB={makeTagDB(mockAutos)}
        configAutomationMetadatas={mockAutos.map(({ metadata }) => metadata)}
        onAutomationDelete={(aid) => {
          args.onAutomationDelete(aid);
          setAutos(mockAutos.filter(({ metadata }) => metadata.id !== aid));
        }}
        onAutomationUpdate={(a, aid, eid) => {
          args.onAutomationUpdate(a, aid, eid);
          const index = mockAutos.findIndex(
            ({ metadata }) => metadata.id === aid
          );
          if (index >= 0) {
            setAutos([
              ...mockAutos.slice(0, index),
              {
                ...mockAutos[index],
                metadata: {
                  ...mockAutos[index].metadata,
                  alias: a.title,
                  description: a.description,
                },
              },
              ...mockAutos.slice(index + 1),
            ]);
          }
          setMES({
            ...mockEntitiesStates,
            [eid]: a.state,
          });
        }}
        onTagUpdate={(tags, aid) => {
          args.onTagUpdate(tags, aid);
          const index = mockAutos.findIndex(
            ({ metadata }) => metadata.id === aid
          );
          if (index >= 0) {
            setAutos([
              ...mockAutos.slice(0, index),
              {
                ...mockAutos[index],
                tags,
              },
              ...mockAutos.slice(index + 1),
            ]);
          }
        }}
      />
    </Page>
  );
};
