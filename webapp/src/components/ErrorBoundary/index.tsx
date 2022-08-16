import "./index.css";
import { Component, ErrorInfo, ReactNode } from "react";
import Alert from "@mui/material/Alert";
import { Button } from "components/Inputs/Buttons/Button";

type State =
  | {
      hasError: false;
    }
  | {
      hasError: true;
      error: any;
      errorInfo?: ErrorInfo;
    };
export class ErrorBoundary extends Component<
  {
    children: ReactNode;
    additionalContext?: any;
  },
  State
> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: any): State {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>An Error has occured.</h1>
          <Alert color="error">{String(this.state.error)}</Alert>
          {!!this.props.additionalContext && (
            <>
              <h4>Error Context</h4>
              <Alert color="warning" className="error-boundary--context">
                {JSON.stringify(this.props.additionalContext, null, 4)}
              </Alert>
            </>
          )}
          <h4>Error Stack</h4>
          <Alert color="error" className="error-boundary--stack">
            {JSON.stringify(this.state.error, null, 4)}
            <br />
            {this.state.errorInfo &&
              this.state.errorInfo.componentStack.split("\n").map((s, i) => (
                <>
                  <span key={i}>{s}</span>
                  <br key={`br-${i}`} />
                </>
              ))}
          </Alert>
          <div className="error-boundary--buttons">
            <Button onClick={() => (document.cookie = "")}>
              Clear cookies
            </Button>
            <Button
              color="warning"
              onClick={() =>
                window.open(
                  "https://github.com/asosnovsky/Shortumation/issues/new?labels=bug%2C+triage&template=bug_report.md",
                  "_blank",
                  "top=0,left=0,width=600px,height=800px"
                )
              }
            >
              Report This Bug
            </Button>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
