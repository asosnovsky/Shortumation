import { AutomationNode } from "./types";


export const getNameFromAction = (action: AutomationNode<any>): string => {
    if(typeof action === 'string') {
        return action;
    }
    if ('alias' in action && action.alias){
        return action.alias;
    }
    if ('service' in action) {
        return action.service
    }
    if ('repeat' in action) {
        return 'Repeat'
    }
    if ('wait_template' in action) {
        return 'Wait'
    }
    if ('event' in action) {
        return  action.event
    }
    if ('type' in action) {
        return 'Device ' +action.type
    }
    if ('choose' in action) {
        return 'Choose'
    }
    return 'n/a'
}