import { FC } from 'react';
import { IconBaseProps } from './base';
import { createAppUseStyles } from 'styles/theme';

export interface ButtonIconStyleProps {
}
export interface ButtonIconProps extends IconBaseProps, ButtonIconStyleProps {
  Icon: FC<IconBaseProps>;
}
const useButtonIconStyles = createAppUseStyles(theme => ({
  buttonIcon: {
    borderRadius: "100%",
    borderWidth: 1,
    borderStyle: "groove",
    padding: "0.25em",
    "&:hover": {
      backgroundColor: theme.secondaryAccent,
      cursor: 'pointer',
    }
  }
}))


export const ButtonIcon: FC<ButtonIconProps> = ({
  Icon,
  className,
  ...props
}) => <Icon
    className={`${useButtonIconStyles({}).classes.buttonIcon} ${className}`} {...props}
  />
