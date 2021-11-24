import { ComponentStory } from "@storybook/react";
import { usePageTheme } from "styles/page";
import { IconBase } from "./base";
import {PencilIcon, CheckMarkIcon} from ".";

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
