import "styles/root.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { ComponentProps, JSXElementConstructor } from "react";

export type MakeStoryArgs<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = {
  Component: T;
  BaseTemplate?: ComponentStory<T>;
  meta: Partial<ComponentMeta<T>> & { title: string };
};
export const makeStory = <
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
>({
  BaseTemplate,
  Component,
  meta,
}: MakeStoryArgs<T>) => {
  const componentMeta: ComponentMeta<T> = {
    component: Component as any,
    parameters: { actions: { argTypesRegex: "^on.*" } },
    args: {},
    ...meta,
  };
  const Template: ComponentStory<T> = (args) => {
    return (
      <Page>
        {BaseTemplate ? <BaseTemplate {...args} /> : <Component {...args} />}
      </Page>
    );
  };

  const make = (args: Partial<ComponentProps<T>>) => {
    const Basic = Template.bind({});
    Basic.args = {
      ...Basic.args,
      ...args,
    };
    return Basic;
  };

  return {
    make,
    componentMeta,
  };
};
