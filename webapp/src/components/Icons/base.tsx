import { createAppUseStyles } from 'styles/theme';
import { AnchorHTMLAttributes, FC } from "react";


export type IconStyleProps = {
  size?: number;
  units?: 'em' | 'px' | '%';
  color?: string;
}
export const useIconStyles = createAppUseStyles<IconStyleProps>(theme => ({
  icon: ({ size, units = 'em' }) => ({
    height: `${size}${units}`,
    width: `${size}${units}`,
    display: 'flex',
  }),
  svg: ({ color = theme.primaryAccent }) => ({
    fill: color
  })
}))

export type IconBaseProps = AnchorHTMLAttributes<HTMLAnchorElement> & IconStyleProps;
export const IconBase: FC<IconBaseProps & { viewBox: string }> = ({
  children,
  viewBox,
  size = 1,
  color,
  units,
  className = "",
  ...props
}) => {
  const { classes } = useIconStyles({ size, color, units, });
  return <a className={`${classes.icon} ${className}`} {...props}>
    <svg className={classes.svg} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox={viewBox}>
      <g>
        {children}
      </g>
    </svg>
  </a>
}
