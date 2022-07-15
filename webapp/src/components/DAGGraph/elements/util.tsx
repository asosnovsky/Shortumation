import { MiniFailure } from "types/validators/helper";
import { SequenceNodeColor } from "../nodes/SequenceNode/types";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const convertFailuresToSequenceNodeDataProps = (
  failures: MiniFailure[]
) => {
  return {
    label: (
      <>
        <InfoOutlinedIcon />
        <div className="daggraph--error">
          {failures.map((f, i) => (
            <span key={i}>{f.message}</span>
          ))}
        </div>
      </>
    ),
    color: "error" as SequenceNodeColor,
  };
};
