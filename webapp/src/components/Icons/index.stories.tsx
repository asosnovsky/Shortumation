import { ComponentStory } from "@storybook/react";

import { IconBase } from "./base";
import {
  PencilIcon,
  CheckMarkIcon,
  TrashIcon,
  InfoIcon,
  ArrowIcon,
  AddIcon,
  ZoomIcon,
  GearIcon,
} from ".";
import { ButtonIcon } from "./ButtonIcons";
import { MockPage } from "components/Page";

export default {
  title: "Icons",
  component: IconBase,
};

export const IconList: ComponentStory<typeof IconBase> = (args) => {
  return (
    <MockPage>
      <PencilIcon {...args} />
      <CheckMarkIcon {...args} />
      <AddIcon {...args} />
      <TrashIcon {...args} />
      <InfoIcon {...args} />
      <ZoomIcon {...args} />
      <GearIcon {...args} />
    </MockPage>
  );
};
IconList.args = {
  size: 2,
  color: "red",
};

export const ButtonIconExample: ComponentStory<typeof IconBase> = (args) => {
  return (
    <MockPage>
      <ButtonIcon icon={<ArrowIcon {...args} />} />
    </MockPage>
  );
};
ButtonIconExample.args = {
  size: 2,
  color: "red",
};
