import { FC } from "react";
import { createAppUseStyles } from "styles/theme";
import Color from 'chroma-js';

export interface ModalStyleProps {
  open: boolean;
}
export interface Props extends ModalStyleProps {
}
const useModalStyle = createAppUseStyles<ModalStyleProps>(theme => ({
  root: ({ open }) => ({
    display: open ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: open ? 10 : -1,
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    top: 0,
    left: 0,
  }),
  background: {
    zIndex: 5,
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    top: 0,
    left: 0,
    backgroundColor: Color(theme.secondary).alpha(0.5).hex(),
  },
  inner: {
    zIndex: 10,
    maxWidth: '80%',
    maxHeight: '60%',
    minHeight: '200px',
    minWidth: '200px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.primary,
    borderSize: '1px',
    borderStyle: 'solid',
    borderColor: theme.primaryAccent,
    borderRadius: '10px',
    color: theme.primaryAccent,
  }
}));
export const Modal: FC<Props> = ({
  children,
  ...props
}) => {
  const { classes } = useModalStyle(props);
  return <div className={classes.root}>
    <div className={classes.background} />
    <div className={classes.inner}>
      {children}
    </div>
  </div>
}
