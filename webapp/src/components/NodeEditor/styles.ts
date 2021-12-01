import Color from "chroma-js";
import { createAppUseStyles } from "styles/theme";

export const useNodeEditorStyles = createAppUseStyles<{

}>(theme => ({
  root: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    left: '0',
    top: '0',
  },
  background: {
    position: 'absolute',
    zIndex: 0,
    width: '100vw',
    height: '100vw',
    backgroundColor: Color(theme.secondary).alpha(0.5).hex(),
  },
  inner: {
    zIndex: 1,
    maxWidth: '80%',
    maxHeight: '60%',
    minHeight: '200px',
    minWidth: '200px',
    borderRadius: '20px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.primary,
    borderSize: '1px',
    borderStyle: 'solid',
    borderColor: theme.primaryAccent,
  },
  title: {
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
    color: theme.secondaryAccent,
  },
  body: {
    flexGrow: 1
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}))
