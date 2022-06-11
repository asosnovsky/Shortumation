import { AutomationTime, AutomationTimeObject, AutomationTimeString } from "types/automations/common";

const cleanTime = (t: number) => Math.max(0, Math.floor(t))

export const milisecondsToObject = (total_miliseconds: number): AutomationTimeObject => {
    const hours = cleanTime(total_miliseconds / (60 * 60 * 1000));
    const minutes = cleanTime((total_miliseconds - hours * 60 * 60 * 1000) / (60 * 1000));
    const seconds = cleanTime((total_miliseconds - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000);
    const milliseconds = total_miliseconds - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000;
    return {
        hours, minutes, seconds, milliseconds,
    }
}

export const convertStringToAutomationTimeObject = (t: AutomationTimeString): AutomationTimeObject => {
    const bits = t.split(':')
    return {
        hours: Number(bits[0]),
        minutes: Number(bits[1]),
        seconds: bits.length === 3 ? Number(bits[2]) : 0,
    }
}

export const convertObjectToAutomationTimeString = (t: AutomationTimeObject): AutomationTimeString => {
    const {
        hours = 0,
        minutes = 0,
        seconds = 0
    } = t
    return [hours, minutes, seconds].map(x => String(x).padStart(2, '0')).join(':')
}

export const convertAutomationTimeToTimeString = (t: AutomationTime | undefined): AutomationTimeString => {
    let obj: AutomationTimeObject;
    if (typeof t === 'string') {
        obj = convertStringToAutomationTimeObject(t)
    } else if (!t) {
        return "00:00:00"
    } else {
        obj = t
    }
    return convertObjectToAutomationTimeString(obj);
}


export const convertAutomationTimeToTimeObject = (t: AutomationTime | undefined): AutomationTimeObject => {
    return convertStringToAutomationTimeObject(convertAutomationTimeToTimeString(t))
}