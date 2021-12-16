import { createAppUseStyles } from "styles/theme";


export const useEditorStyles = createAppUseStyles<{
  closeInfo: boolean;
  horizontalMode: boolean;
}>(theme => ({
  root: ({horizontalMode}) => ({
    height: '100%',
    width: '100%',
    color: theme.primaryAccent,
    display: 'flex',
    flexDirection: horizontalMode ? 'column' : 'row',
  }),
  dag: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.secondaryAccent,
    width: '100%',
  },
  infoBox: ({closeInfo}) => ({
    width: closeInfo ? 0 : 'auto',
    paddingLeft: '10px',
    paddingRight: '10px',
    display:  closeInfo ? 'none' : 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'auto',
    paddingTop: 5,
    paddingBottom: 10,
    position: 'relative',
  }),
  infoIcon: ({closeInfo, horizontalMode}) => ({
    position: 'absolute',
    top: horizontalMode ? '90%' : 10,
    left: horizontalMode ? "3%" : closeInfo ? "2.5%" :"20%",
    zIndex: 10,
    background: theme.secondary,
    "&:hover": {
      background: theme.secondaryAccent,
      borderRadius: 100,
      cursor: 'pointer',
    }
  })
}))
