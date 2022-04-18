import "./index.css";
import { Component, ErrorInfo } from "react";

type State = {
    hasError: false;
} | {
    hasError: true,
    error: any,
    errorInfo?: ErrorInfo,
}
export class ErrorBoundary extends Component<{}, State> {

    state: State = {
        hasError: false
    }

    static getDerivedStateFromError(error: any): State {
        return { error, hasError: true, };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            hasError: true,
            error,
            errorInfo,
        })
    }

    render() {
        if (this.state.hasError) {
            return <div className="error-boundary">
                <h1>An Error has occured.</h1>
                <h2>{String(this.state.error)}</h2>
                {JSON.stringify(this.state.error, null, 4)}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack.split('\n').map((s, i) => <>
                    <span key={i}>{s}</span><br key={`br-${i}`} />
                </>)}
            </div>
        }

        return this.props.children;
    }
}