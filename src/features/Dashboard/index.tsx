import { Container } from "@nextui-org/react";

import ScratchesTable from "./ScratchView/OrgsTable/ScratchesTable";
import NonScratchesTable from "./ScratchView/OrgsTable/NonScratchesTable";
import CurrentUserDetails from "./CurrentUser/CurrentUserDetails";

function Dashboard() {
  return (
    <Container
      justify="center"
      css={{
        mt: 20,
      }}
    >
      <CurrentUserDetails />
      <ScratchesTable />
      <NonScratchesTable />
    </Container>
  );
}

export default Dashboard;
