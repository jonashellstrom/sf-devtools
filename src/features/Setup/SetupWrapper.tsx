import { Container } from "@nextui-org/react";
import shallow from "zustand/shallow";

import { useZustand } from "../../hooks/useZustand";
import SetupModal from "./SetupModal";

function SetupWrapper({ children }: React.PropsWithChildren) {
  const sfdxPath = useZustand((state) => state.sfdxPath, shallow);
  if (!sfdxPath)
    return (
      <Container
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: "100%",
          backgroundImage: "linear-gradient(130deg, white, #68ABF8, #53E492)",
        }}
      >
        <SetupModal />
      </Container>
    );
  return <>{children}</>;
}

export default SetupWrapper;
