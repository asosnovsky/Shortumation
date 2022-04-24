import { createAppUseStyles } from "styles/theme";


export const useEditorStyles = createAppUseStyles<{
  closeInfo: boolean;
  horizontalMode: boolean;
  autoChanged: string;
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

  },
  toolbar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    padding: "0.5em",
  },
  saveBtn: ({ autoChanged }) => ({
    display: "flex",
    opacity: autoChanged === "changed" ? 1 : 0,
    height: autoChanged === "changed" ? undefined : 0,
    fontSize: autoChanged === "changed" ? undefined : 0,
    gap: '0.5em',
    maxHeight: '1em',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#bf4 !important",
    color: "#bf4 !important"
  }),
}))
