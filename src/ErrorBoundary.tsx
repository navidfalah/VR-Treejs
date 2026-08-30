import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    error: Error | null;
}

// Catches render errors in the 3D scene tree (e.g. WebGL context loss,
// bad geometry args) so the rest of the UI stays usable instead of a blank page.
export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
        console.error('Scene crashed:', error, info.componentStack);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="scene-error">
                    <div className="scene-error-box">
                        <h1>Something went wrong</h1>
                        <p>{this.state.error.message}</p>
                        <button onClick={() => this.setState({ error: null })}>
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
