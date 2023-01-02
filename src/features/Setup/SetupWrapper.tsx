import { Container } from "@nextui-org/react";

import { useZustand } from "../../hooks/useZustand";
import SetupModal from "./SetupModal";

function SetupWrapper({ children }: React.PropsWithChildren) {
  const sfdxPath = useZustand((state) => state.sfdxPath);
  if (!sfdxPath)
    return (
      <Container
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: "100%",
          backgroundImage: "linear-gradient(130deg, #56DFFF, #4EFFCC)",
        }}
      >
        <SetupModal />
      </Container>
    );
  return <>{children}</>;
}

export default SetupWrapper;
