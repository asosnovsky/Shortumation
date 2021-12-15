import Color from "chroma-js";
import { createAppUseStyles } from "styles/theme";

export const useNodeEditorStyles = createAppUseStyles<{

}>(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
    color: theme.secondaryAccent,
  },
  body: {
    overflow: 'auto',
    resize: 'auto',
    flexGrow: 1
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  }
}))
