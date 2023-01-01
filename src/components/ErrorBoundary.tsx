import { Component, ErrorInfo, ReactNode } from "react";
import { Container, Row, Text } from "@nextui-org/react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container css={{ height: "100vh", width: "100vw" }}>
          <Row align="center" justify="center" css={{ height: "100%" }}>
            <Text h2>Sorry.. something went wrong 🫠</Text>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
