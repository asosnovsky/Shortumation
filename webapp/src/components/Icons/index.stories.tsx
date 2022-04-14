import { ComponentStory } from "@storybook/react";

import { IconBase } from "./base";
import { PencilIcon, CheckMarkIcon, TrashIcon, InfoIcon, ArrowIcon, AddIcon, ZoomIcon } from ".";
import { ButtonIcon } from "./ButtonIcons";

export default {
  title: 'Icons',
  component: IconBase,
};


export const IconList: ComponentStory<typeof IconBase> = (args) => {

  return <div className="page">
    <PencilIcon {...args} />
    <CheckMarkIcon {...args} />
    <AddIcon {...args} />
    <TrashIcon {...args} />
    <InfoIcon {...args} />
    <ZoomIcon {...args} />
  </div>
}
IconList.args = {
  size: 2,
  color: 'red'
}


export const ButtonIconExample: ComponentStory<typeof IconBase> = (args) => {

  return <div className="page">
    <ButtonIcon {...args}>{ArrowIcon}</ButtonIcon>
  </div>
}
ButtonIconExample.args = {
  size: 2,
  color: 'red'
}
