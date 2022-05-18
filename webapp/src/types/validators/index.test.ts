import * as st from "superstruct";
import { AutomationMetadata } from "./metadata";
import { AutomationData } from './autmation';
import { getFailures } from './helper';

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