import { ComponentStory } from "@storybook/react";
import { usePageTheme } from "~/styles/page";
import { IconBase } from "./IconBase";
import {PencilIcon, CheckMarkIcon} from "./icons";

export default {
    title: 'Icons',
    component: IconBase,
};
  

export const IconList: ComponentStory<typeof IconBase> = (args) => {
    const {classes} = usePageTheme({});
    return <div className={classes.page}>
        <PencilIcon {...args}/>
        <CheckMarkIcon {...args}/>
    </div> 
}
IconList.args = {
    size: 2,
    color: 'red'
}