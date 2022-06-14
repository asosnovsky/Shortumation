import React, { FC, useEffect, useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { ServiceEditor } from ".";
import { TypedHassService } from "haService/fieldTypes";

export default {
  title: "Services/ServiceEditor",
  component: ServiceEditor,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {},
} as ComponentMeta<typeof ServiceEditor>;

const Template: ComponentStory<typeof ServiceEditor> = (props) => {
  return (
    <Page>
      <ServiceEditor {...props} />
      <code>{JSON.stringify(props.service)}</code>
    </Page>
  );
};

const makeExample = (service: TypedHassService) => {
  const Eg = Template.bind({});
  Eg.args = {
    ...Eg,
    service,
  };
  return Eg;
};

export const NumberSetValue = makeExample({
  name: "Set",
  description: "Set the value of a Number entity.",
  fields: {
    value: {
      name: "Value",
      description: "The target value the entity should be set to.",
      example: 42,
      selector: { text: null },
    },
  },
  target: { entity: { domain: "number" } },
});
