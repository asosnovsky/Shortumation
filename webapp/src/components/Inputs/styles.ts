import { createAppUseStyles, AppTheme } from "styles/theme";

const commonInputStyle = (theme: AppTheme) => ({
  input: {
    backgroundColor: theme.secondary,
    color: theme.secondaryAccent,
    borderColor: theme.primaryAccent,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: '1em',
    fontSize: 16,

    "&:hover": {
      backgroundColor: theme.primary,
      borderColor: theme.secondaryAccent,
    },
    "&:disabled": {
      backgroundColor: '#403f3f',
      borderColor: '#403f3f',
      cursor: 'not-allowed',
    },
  }
})

export const useButtonStyles = createAppUseStyles<{}>(theme => ({
  input: {
    ...commonInputStyle(theme).input,
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
    cursor: 'pointer',
  },
}));

export const useInputWrapperStyles = createAppUseStyles<{
  labelSize: 'normal' | 'small',
  noMargin: boolean,
  hasError: boolean,
}>(theme => {
  return {
    wrapper: ({ noMargin }) => ({
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      marginTop: noMargin ? 0 : '0.5em',
      marginBottom: noMargin ? 0 : '0.5em',
    }),
    label: ({ labelSize }) => ({
      fontSize: labelSize === 'normal' ? 16 : 10,
      position: 'absolute',
      left: labelSize === 'normal' ? '0.75em' : '1em',
      top: labelSize === 'normal' ? '0.5em' : '0.25em',
      fontWeight: 'bold',
      color: theme.primaryAccent,
    }),
    error: ({ hasError }) => (hasError ? {
      textAlign: 'center',
      color: theme.red,
      padding: '0.25em',
      border: `1px solid ${theme.red}`,
      borderTop: 'none',
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
    } : {})
  }
})

export const useInputTextStyles = createAppUseStyles<{}>(theme => ({
  ...commonInputStyle(theme),
}));


export const useInputTimeStyles = createAppUseStyles<{}>(theme => ({
  input: {
    ...commonInputStyle(theme).input,
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row !important',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel: {
    cursor: 'pointer',
    maxWidth: "2em",
    maxHeight: "2em",
    fontSize: '1em',
    padding: "0.25em 0.5em",
    borderRadius: '20px',
    background: theme.primary,
    color: theme.primaryAccent,
    borderColor: theme.primaryAccent,
    borderStyle: "solid",
    borderWidth: '1.5px',
  },
}));

export const useInputNumberStyles = createAppUseStyles<{}>(theme => {
  const styles = commonInputStyle(theme);
  return {
    input: {
      ...styles.input,
      textAlign: 'center'
    },
    deleteIcon: {
      position: "absolute",
      left: "1em",
      top: "1.5em",
      color: theme.secondaryAccent,
      backgroundColor: theme.secondary,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.secondaryAccent,
      borderRadius: 5,
      cursor: 'pointer',
      padding: "1px 5px",
      "&:hover": {
        backgroundColor: theme.primary,
      }
    },
  }
});

export const useInputListStyles = createAppUseStyles<{
  invalidCurrent: boolean;
}>(theme => {
  const styles = commonInputStyle(theme);
  return {
    input: ({ invalidCurrent }) => ({
      ...styles.input,
      cursor: 'pointer',
      borderColor: invalidCurrent ? theme.redAccent : styles.input.borderColor,
      color: invalidCurrent ? theme.redLight : styles.input.color,
    }),
  }
});

export const useInputMultiSelectStyles = createAppUseStyles<{
  open: boolean;
  selected: number[];
  maxedOut: boolean;
}>(theme => {
  const styles = commonInputStyle(theme);
  return {
    root: {
    },
    input: {
      ...styles.input,
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      gap: '1em',

      "&> label": {
        cursor: 'pointer',
        userSelect: 'none',
      },
      "&:hover": {
        color: theme.primaryAccent,
      }
    },
    numberSelected: (({ selected }) => ({
      display: selected.length > 0 ? 'block' : 'none',
      background: theme.primary,
      borderColor: theme.primaryAccent,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '60%',
      padding: '0em 0.4em'
    })),
    optionsWrapper: (({ open }) => ({
      background: theme.primary,
      borderColor: theme.primaryAccent,
      borderStyle: "solid",
      borderWidth: 1,
      position: 'absolute',
      display: open ? 'flex' : 'none',
      flexDirection: 'column',
      gap: '0.25em',
      left: '0',
      top: 'calc(100% + 0.25em)',
      userSelect: 'none',
      overflow: 'hidden',
      width: "100%",
      zIndex: 10,
    })),
    arrow: (({ open }) => ({
      position: 'absolute',
      right: '1em',
      top: '1em',
      transform: open ? 'rotate(90deg)' : 'rotate(270deg)',
    })),
    option: (({ maxedOut }) => ({
      display: 'flex',
      flexDirection: 'row',
      gap: '0.25em',
      width: '100%',
      padding: '0.25em 0.5em',

      '&.unselected span:nth-child(2)': {
        display: 'none'
      },
      '&.selected span:nth-child(2)': {
        background: theme.primary,
        borderColor: theme.primaryAccent,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '40%',
        padding: '0em 0.4em'
      },

      '&.unselected': {
        cursor: maxedOut ? 'not-allowed' : 'pointer',
      },
      '&.selected': {
        cursor: 'pointer',
      },

      "&:hover": {
        color: theme.secondary,
        backgroundColor: theme.secondaryAccent,
      }
    })),
  }
});

export const useInputTextAreaStyles = createAppUseStyles<{ resizable: boolean }>(theme => {
  const styles = commonInputStyle(theme);
  return {
    input: ({ resizable }) => ({
      ...styles.input,
      resize: resizable ? 'both' : 'none'
    })
  }
});

export const useInputViewEditStyles = createAppUseStyles<{
  isEditing: boolean;
}>(theme => ({
  ...commonInputStyle(theme),
  inputView: {

  },
  checkmark: {

  },
  pencil: {

  }
}));


export const useInputBubblesStyles = createAppUseStyles<{}>(theme => ({
  bubbles: {
    display: 'flex',
    flexDirection: 'row',
    maxHeight: 50,
    maxWidth: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'thin',
  },
  bubble: {
    position: 'relative',
    border: `1px solid ${theme.primaryAccent}`,
    borderRadius: 10,
    backgroundColor: theme.greenOpaque,
    color: theme.primaryLight,
    fontSize: 16,

    marginLeft: 1,
    padding: 5,
    width: 'fit-content',
    whiteSpace: 'nowrap',

    cursor: 'pointer',
    "&:hover": {
      backgroundColor: theme.redOpaque,
      color: theme.primaryLightOpaque,
    },

    "&:hover $deleteIcon": {
      display: 'block',
    }
  },
  deleteIcon: {
    display: 'none',
    position: "absolute",
    left: "48%",
    top: 5,
    color: "white",
  },
  addBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 20,
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.secondary,
    backgroundColor: theme.secondary,
    color: theme.secondaryAccent,
    padding: "3px 7px",
    "&:hover": {
      borderRadius: 100,
      backgroundColor: theme.greenOpaque,
      borderColor: theme.secondaryAccent,
    },
  }
}));

