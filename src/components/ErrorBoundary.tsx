import React from "react";

import NotFoundError from "components/Main/components/NotFoundError";

interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallBackUI?: React.ReactElement;
}

interface ErrorBoundaryState {
  error: boolean;
  info: unknown;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: false,
      info: ""
    };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  // Check if a fallback UI is provided, if not, render a default error
  fallBackUI = () => {
    return this.props.fallBackUI ? (
      this.props.fallBackUI
    ) : (
      <NotFoundError errorMsg={`Error: ${JSON.stringify(this.state.info)}`} />
    );
  };
  // If there is an error, render the fallback UI, else render children
  render() {
    return this.state.error ? this.fallBackUI() : this.props.children;
  }
}

export default ErrorBoundary;
