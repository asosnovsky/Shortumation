import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SVGBoard } from './Board';
import { AddButton } from "./AddButton";


export default {
  title: 'DAGSvgs/AddButton',
  component: AddButton,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    height: 10,
    width: 10,
    loc: [50, 50]
  }
} as ComponentMeta<typeof AddButton>

export const Basic: ComponentStory<typeof AddButton> = args => {
  return <SVGBoard>
    <AddButton
      {...args}
    />
  </SVGBoard>
}
