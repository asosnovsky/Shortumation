import { FC } from 'react';


export const convertToFlowNode = <D extends {}>(
    Component: FC<D>
): FC<{ data: D }> =>
    ({ data }) => {
        return <Component {...data} />
    }
