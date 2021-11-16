import { AnchorHTMLAttributes, FC } from "react";
import { createAppUseStyles } from "~/styles/theme";



export const useIconStyles = createAppUseStyles(theme => ({
    icon: {
        height: '1em',
        width: '1em',
        display: 'flex',
    },
    svg: {
        fill: theme.primaryAccent
    }
}))

export const IconBase: FC<AnchorHTMLAttributes<HTMLAnchorElement> & {
    viewBox: string;
}> = ({children, viewBox, className="", ...props}) => {
    const {classes} = useIconStyles({});
    return <a className={`${classes.icon} ${className}`} {...props}>
            <svg className={classes.svg} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox={viewBox}>
            <g>
                {children}
            </g>
        </svg>
    </a>
}