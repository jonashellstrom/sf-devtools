import { Container } from "@nextui-org/react";
import DebugLogs from "./DebugLogs/DebugLogs";

import TraceFlagList from "./TraceFlags/TraceFlagList";

function Debugging() {
  return (
    <Container css={{ pt: 30 }}>
      <TraceFlagList />
      <DebugLogs />
    </Container>
  );
}

export default Debugging;
