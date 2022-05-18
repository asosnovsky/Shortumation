import * as st from 'superstruct';

export type MiniFailure = {
    path: string,
    message: string[],
}

export const getFailures = <T, S>(value: unknown, struct: st.Struct<T, S>): MiniFailure[] | null => {
    try {
        st.assert(value, struct)
    } catch (err) {
        if (err instanceof st.StructError) {
            const failureMap = err.failures().reduce((all: Record<string, Set<string>> = {}, next) => {
                const path = next.path.join('.');
                if (all[path]) {
                    all[path].add(next.message)
                } else {
                    all[path] = new Set([next.message])
                }
                return all
            }, {})
            return Object.keys(failureMap).map((path) => ({
                path,
                message: Array.from(failureMap[path].values())
            }))
        }
        throw err
    }

    return null
}