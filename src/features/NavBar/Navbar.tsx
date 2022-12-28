import { Navbar as NUINavbar, Row, Text } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";

import MiniOrgInfo from "../Dashboard/CurrentUser/MiniOrgInfo";
import NavbarActions from "./NavbarActions";

export const ROUTES = {
  root: "/",
  apexConsole: "apex-console",
  debugging: "debug",
} as const;

function Navbar() {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  return (
    <NUINavbar isBordered variant="floating" css={{ zIndex: 10000 }}>
      <NUINavbar.Brand>
        <Text size={24} weight="bold">
          SF DevTools
        </Text>
      </NUINavbar.Brand>
      <NUINavbar.Content
        enableCursorHighlight
        activeColor="secondary"
        variant="underline"
      >
        <NUINavbar.Link
          isActive={currentPath === "/"}
          onClick={() => navigate(ROUTES.root)}
        >
          Org Dashboard
        </NUINavbar.Link>
        <NUINavbar.Link
          isActive={currentPath === "/apex-console"}
          onClick={() => navigate(ROUTES.apexConsole)}
        >
          Anonymous Apex
        </NUINavbar.Link>
        <NUINavbar.Link
          isActive={currentPath === "/debug"}
          onClick={() => navigate(ROUTES.debugging)}
        >
          Debug Logs
        </NUINavbar.Link>
      </NUINavbar.Content>
      <NUINavbar.Content css={{ justifyContent: "flex-end" }}>
        <Row align="center">
          <MiniOrgInfo />
          <NavbarActions />
        </Row>
      </NUINavbar.Content>
    </NUINavbar>
  );
}

export default Navbar;
