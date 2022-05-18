import * as st from "superstruct";
import { AutomationMetadata } from "./metadata";
import { AutomationData } from './autmation';
import { getFailures } from './helper';
import { AutomationTimeString } from "./common";

test('superstructure is', () => {
    const badCheck = st.is({}, AutomationMetadata);
    expect(badCheck).toBeFalsy()
})

test('getFailures returns failures', () => {
    const failures = getFailures({ metadata: {} }, AutomationData);
    expect(failures).toHaveLength(8)
})

test('getFailures returns null', () => {
    const failures = getFailures({
        id: "test",
        alias: "hey",
        description: "wow",
        mode: "single",
    }, AutomationMetadata);
    expect(failures).toBeNull()
})

test('AutomationTimeString is valid', () => {
    for (const c of [
        '10:23',
        '15:02',
        '13:00:1',
        '23:00:23'
    ]) {
        const failures = getFailures(c, AutomationTimeString)
        expect(failures).toBeNull()
    }
})


test('AutomationTimeString is invalid', () => {
    for (const c of [
        'xx:23',
        '1x:02',
        '13:0a:1c',
        '25:00:23',
        '11'
    ]) {
        const failures = getFailures({
            "time": c
        }, st.object({
            time: AutomationTimeString,
        }))
        expect(failures).toHaveLength(1)
    }
})