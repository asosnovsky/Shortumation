import { FC } from "react";
import useWindowSize from "utils/useWindowSize";


export const SizeModal: FC = () => {
    const size = useWindowSize();

    return <span style={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'white',
        zIndex: 10,
    }}>{size.width}/{size.height}={size.ratioWbh} ({size.isMobile ? 'm' : 'd'})</span>
}