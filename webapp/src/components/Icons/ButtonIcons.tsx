import { FC } from 'react';
import { IconBaseProps } from './base';
import { createAppUseStyles } from 'styles/theme';

export interface ButtonIconStyleProps {
}
export interface ButtonIconProps extends IconBaseProps, ButtonIconStyleProps {
  children: FC<IconBaseProps>;
}
const useButtonIconStyles = createAppUseStyles(theme => ({
  buttonIcon: {
    borderRadius: "100%",
    backgroundColor: theme.primary,
    borderColor: theme.primaryAccent,
    borderWidth: 1,
    borderStyle: "groove",
    padding: "0.25em",
    "&:hover": {
      backgroundColor: theme.primaryAccent,
      cursor: 'pointer',
    }
  }
}))


export const ButtonIcon: FC<ButtonIconProps> = props => <props.children
  className={useButtonIconStyles({}).classes.buttonIcon}
/>
