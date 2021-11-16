import { usePageTheme } from "~/styles/page";
import {PencilIcon, CheckMarkIcon} from "./icons";

export default {
    title: 'Icons',
};
  

const Template = () => {
    const {classes} = usePageTheme({});
    return <div className={classes.page}>
        <PencilIcon/>
        <CheckMarkIcon/>
    </div> 
}

export const IconList = Template.bind({})
// SimpleText.args = {}