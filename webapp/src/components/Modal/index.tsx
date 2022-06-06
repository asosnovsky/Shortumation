import { FC, ReactNode } from "react";
import { createAppUseStyles } from "styles/theme";

export interface ModalStyleProps {
  open: boolean;
}
export interface Props extends ModalStyleProps {
  children: ReactNode;
}
const useModalStyle = createAppUseStyles<ModalStyleProps>(theme => ({
  root: ({ open }) => ({
    display: open ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: open ? 10 : -1,
    position: 'fixed',
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
    backgroundColor: theme.secondaryOpaque,
  },
  inner: {
    zIndex: 10,
    maxWidth: '80vw',
    maxHeight: '90vh',
    minHeight: 'min-content',
    minWidth: '100px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.primary,
    borderSize: '1px',
    borderStyle: 'solid',
    borderColor: theme.primaryAccent,
    borderRadius: '10px',
    color: theme.primaryAccent,
    overflow: "auto",
    resize: "auto",
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
