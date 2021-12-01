import { ButtonHTMLAttributes, FC } from "react";
import { createAppUseStyles } from "styles/theme";
import { useButtonStyles } from "./styles";

// const useButtonStyles = createAppUseStyles(theme => ({
//   button: {
//     backgroundColor: theme.secondary,
//     color: theme.primaryAccent,
//     borderColor: theme.primaryAccent,
//     borderStyle: 'solid',
//     borderWidth: 1,
//     padding: '2.5%',
//     marginLeft: '5%',
//     marginRight: '5%',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     '&:hover': {
//       backgroundColor: theme.primary,
//       borderColor: theme.secondaryAccent,
//     }
//   }
// }))
export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => {
  const { classes } = useButtonStyles({});
  return <button {...props} className={`${classes.input} ${props.className ?? ''}`} />
}
