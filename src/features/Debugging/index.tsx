import { Container, Text } from "@nextui-org/react";
import DebugLogs from "./DebugLogs/DebugLogs";

import TraceFlagList from "./TraceFlags/TraceFlagList";

function Debugging() {
  return (
    <Container css={{ pt: 30 }}>
      <TraceFlagList />
      <Text h4 b>
        Tailed Logs
      </Text>
      <DebugLogs />
    </Container>
  );
}

export default Debugging;
