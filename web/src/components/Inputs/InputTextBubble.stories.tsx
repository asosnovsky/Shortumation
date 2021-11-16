import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { usePageTheme } from "~/styles/page";
import InputTextBubble, { InputEntity } from "./InputTextBubble";

export default {
    title: 'Inputs/InputTextBubble',
    component: InputTextBubble,
    parameters: { actions: { argTypesRegex: '^on.*' } },
    argTypes: {
        label: {
            defaultValue: 'Sample Title'
        }
    }
  } as ComponentMeta<typeof InputTextBubble>;
  

  export const ArrayText: ComponentStory<typeof InputTextBubble> = args => {
    const {classes} = usePageTheme({});
    const [value, setValue] = useState<string | string[]>(['wow','lots of bubbles', 'itchen', 'bathroom'])
    return <div className={classes.page}>
        <div style={{maxWidth: '200px', overflow: 'hidden'}}>
            <InputTextBubble {...args} value={value} onChange={setValue}/>
        </div>
    </div> 
}

export const JustText: ComponentStory<typeof InputTextBubble> = args => {
    const {classes} = usePageTheme({});
    const [value, setValue] = useState<string | string[]>('hello')
    return <div className={classes.page}>
        <InputTextBubble {...args} value={value} onChange={setValue}/>
    </div> 
}


export const EntityId: ComponentStory<typeof InputTextBubble> = args => {
    const {classes} = usePageTheme({});
    const [value, setValue] = useState<string | string[]>(['sensor.bathroom'])
    return <div className={classes.page}>
        <InputEntity value={value} onChange={setValue}/>
    </div> 
}
