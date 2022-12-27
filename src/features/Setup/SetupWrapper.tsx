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
          backgroundImage:
            "linear-gradient(120deg, white, #D0DEE3, #95C7DC, #719BE5)",
        }}
      >
        <SetupModal />
      </Container>
    );
  return <>{children}</>;
}

export default SetupWrapper;
