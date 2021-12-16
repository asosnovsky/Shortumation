import { createAppUseStyles } from 'styles/theme';
import { AnchorHTMLAttributes, FC, SVGProps } from "react";


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
    justifyContent: 'center',
    alignItems: 'center',
  }),
  svg: ({ color = theme.primaryAccent, size, units = 'em' }) => ({
    height: `${size}${units}`,
    width: `${size}${units}`,
    fill: color
  })
}))

export type IconBaseProps = AnchorHTMLAttributes<HTMLAnchorElement> & IconStyleProps;
export const IconBase: FC<IconBaseProps & { svgProps: SVGProps<SVGSVGElement> }> = ({
  children,
  svgProps = {},
  size = 1,
  color,
  units,
  className = "",
  ...props
}) => {
  const { classes } = useIconStyles({ size, color, units, });
  return <a className={`${classes.icon} ${className}`} {...props}>
    <svg className={classes.svg} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" {...svgProps}>
      <g>
        {children}
      </g>
    </svg>
  </a>
}
