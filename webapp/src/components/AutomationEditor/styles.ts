import { createAppUseStyles } from "styles/theme";


export const useEditorStyles = createAppUseStyles<{
  closeInfo: boolean;
  horizontalMode: boolean;
}>(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "flex-end",
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  root: ({ horizontalMode }) => ({
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
  infoIcon: ({ horizontalMode }) => ({
    bottom: horizontalMode ? '90%' : 10
  }),
  zoom: {
    backgroundColor: theme.secondary,
    color: theme.secondaryAccent,
    textAlign: 'center',
    maxWidth: "3em",
  },
  zoomImg: {
    // width: "1em",

  },
  toolbar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: 'start',
    alignItems: "center",
  }
}))
