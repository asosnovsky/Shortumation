import { createAppUseStyles, AppTheme } from "styles/theme";
import Color from 'chroma-js';

const commonInputStyle = (theme: AppTheme) => ({
  input: {
    backgroundColor: theme.secondary,
    color: theme.secondaryAccent,
    borderColor: theme.primaryAccent,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginLeft: 5,
    marginRight: 5,
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
    paddingTop: '2%',
    paddingBottom: '2%',
    cursor: 'pointer',
  },
}));

export const useInputWrapperStyles = createAppUseStyles<{
  labelSize: 'normal' | 'small',
  noMargin: boolean,
}>(theme => {
  return {
    wrapper: ({ noMargin }) => ({
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      marginTop: noMargin ? 0 : 10,
      marginBottom: noMargin ? 0 : '0.25em',
    }),
    label: ({ labelSize }) => ({
      fontSize: labelSize === 'normal' ? 16 : 10,
      position: 'absolute',
      left: labelSize === 'normal' ? '0.75em' : '1em',
      top: labelSize === 'normal' ? '0.5em' : '0.25em',
      fontWeight: 'bold',
      color: theme.primaryAccent,
    })
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
      left: 30,
      top: 17,
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

export const useInputListStyles = createAppUseStyles<{}>(theme => {
  const styles = commonInputStyle(theme);
  return {
    input: {
      ...styles.input,
      cursor: 'pointer'
    }
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
    backgroundColor: Color(theme.primary).set('rgb.g', 150).alpha(0.35).hex(),
    color: Color(theme.primary).brighten(5).hex(),
    fontSize: 16,

    marginLeft: 1,
    padding: 5,
    width: 'fit-content',
    whiteSpace: 'nowrap',

    cursor: 'pointer',
    "&:hover": {
      backgroundColor: Color(theme.primary).set('rgb.r', 150).alpha(0.35).hex(),
      color: Color(theme.primary).brighten(5).alpha(0.35).hex(),
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
      backgroundColor: Color(theme.primary).set('rgb.g', 150).alpha(0.35).hex(),
      borderColor: theme.secondaryAccent,
    },
  }
}));

