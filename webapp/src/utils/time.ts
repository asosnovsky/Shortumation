import { AutomationTime } from "types/automations/common";

const cleanTime = (t: number) => Math.max(0, Math.floor(t))

export const milisecondsToObject = (total_miliseconds: number): AutomationTime => {
    const hours = cleanTime(total_miliseconds / (60 * 60 * 1000));
    const minutes = cleanTime((total_miliseconds - hours * 60 * 60 * 1000) / (60 * 1000));
    const seconds = cleanTime((total_miliseconds - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000);
    const milliseconds = total_miliseconds - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000;
    return {
        hours, minutes, seconds, milliseconds,
    }
}