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
  infoIcon: ({horizontalMode}) => ({
    bottom: horizontalMode ? '90%' : 10
  })
}))
