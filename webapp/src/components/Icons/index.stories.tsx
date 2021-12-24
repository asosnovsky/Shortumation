import { ComponentStory } from "@storybook/react";
import { usePageTheme } from "styles/page";
import { IconBase } from "./base";
import { PencilIcon, CheckMarkIcon, TrashIcon, InfoIcon, ArrowIcon } from ".";
import { AddIcon } from './index';
import { ButtonIcon } from "./ButtonIcons";

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
    <InfoIcon {...args} />
  </div>
}
IconList.args = {
  size: 2,
  color: 'red'
}


export const ButtonIconExample: ComponentStory<typeof IconBase> = (args) => {
  const { classes } = usePageTheme({});
  return <div className={classes.page}>
    <ButtonIcon {...args}>{ArrowIcon}</ButtonIcon>
  </div>
}
ButtonIconExample.args = {
  size: 2,
  color: 'red'
}
