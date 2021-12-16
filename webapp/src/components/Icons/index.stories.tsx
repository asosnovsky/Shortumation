import { ComponentStory } from "@storybook/react";
import { usePageTheme } from "styles/page";
import { IconBase } from "./base";
import { PencilIcon, CheckMarkIcon, TrashIcon } from ".";
import { AddIcon } from './index';

export default {
  title: 'Icons',
  component: IconBase,
};


export const IconList: ComponentStory<typeof IconBase> = (args) => {
  const { classes } = usePageTheme({});
  return <div className={classes.page}>
    <PencilIcon {...args} />
    <CheckMarkIcon {...args} />
    <AddIcon {...args} />
    <TrashIcon {...args} />
  </div>
}
IconList.args = {
  size: 2,
  color: 'red'
}
