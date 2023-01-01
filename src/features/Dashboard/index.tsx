import { Container } from "@nextui-org/react";

import CurrentUserDetails from "./CurrentUser/CurrentUserDetails";
import OrgsTables from "./OrgView/OrgsTable/OrgsTables";

function Dashboard() {
  return (
    <Container
      justify="center"
      css={{
        mt: 20,
      }}
    >
      <CurrentUserDetails />
      <OrgsTables />
    </Container>
  );
}

export default Dashboard;
