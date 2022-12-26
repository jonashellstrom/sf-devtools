import { Container } from "@nextui-org/react";
import DebugLogs from "./DebugLogs/DebugLogs";

import TraceFlagList from "./TraceFlags/TraceFlagList";

function Debugging() {
  return (
    <Container css={{ pt: 20 }}>
      <TraceFlagList />
      <DebugLogs />
    </Container>
  );
}

export default Debugging;
