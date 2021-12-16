import { createAppUseStyles } from "styles/theme";


export const useEditorStyles = createAppUseStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    color: theme.primaryAccent,
    display: 'flex',
    flexDirection: 'row',
  },
  dag: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.secondaryAccent,
    width: '100%',
  },
  infoBox: {
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'auto',
  },
}))
