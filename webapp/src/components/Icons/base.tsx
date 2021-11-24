import { createAppUseStyles } from 'styles/theme';
import { AnchorHTMLAttributes, FC } from "react";



export const useIconStyles = createAppUseStyles<{size: number, color?: string}>(theme => ({
    icon: ({size}) => ({
        height: `${size}em`,
        width: `${size}em`,
        display: 'flex',
    }),
    svg: ({color=theme.primaryAccent}) => ({
        fill: color
    })
}))

export type IconBaseProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    size?: number;
    color?: string;
}
export const IconBase: FC<IconBaseProps & { viewBox: string }> = ({
    children, 
    viewBox, 
    size=1,
    color,
    className="", 
    ...props
}) => {
    const {classes} = useIconStyles({ size, color });
    return <a className={`${classes.icon} ${className}`} {...props}>
            <svg className={classes.svg} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox={viewBox}>
            <g>
                {children}
            </g>
        </svg>
    </a>
}
