import React, { Component,type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: any) {
        console.error("Caught by ErrorBoundary:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    <h2>אופס! משהו השתבש כאן 😅</h2>
                    <p>נסי לרענן את הדף או חזרי לדף הבית.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;