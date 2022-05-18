import { useRef, useEffect } from 'react';


export const useDelayEffect = (cb: () => void, deps: any[], timeout: number) => {
    const fcn = useDelayedFunction(cb, timeout);
    useEffect(() => {
        fcn()
    }, deps)
}

export const useDelayedFunction = <FcnParams extends any[]>(
    cb: (...p: FcnParams) => void, timeout: number
) => {
    const timeid = useRef<number | null>(null);
    return (...args: FcnParams) => {
        if (timeid.current) {
            window.clearTimeout(timeid.current)
        }
        timeid.current = window.setTimeout(() => {
            cb(...args)
        }, timeout)
    }
}