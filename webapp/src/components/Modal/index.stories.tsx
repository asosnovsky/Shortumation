import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Modal } from ".";
import { useState } from 'react';
import { Button } from "components/Inputs/Button";


export default {
  title: 'Modal',
  component: Modal,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    open: true
  }
} as ComponentMeta<typeof Modal>

export const Simple: ComponentStory<typeof Modal> = args => {
  return <>
    <Modal {...args}>
      <div>Hello World!</div>
    </Modal>
  </>
}
export const WithButtons: ComponentStory<typeof Modal> = args => {
  const [open, setOpen] = useState(false);
  return <>
    <Button onClick={() => setOpen(!open)}>Open Me!</Button>
    <Modal open={open}>
      <div>Hello World!</div>
      <Button onClick={() => setOpen(!open)}>Close Me!</Button>
    </Modal>
  </>
}
