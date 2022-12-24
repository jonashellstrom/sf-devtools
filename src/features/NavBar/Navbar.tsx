import {
  Col,
  Navbar as NUINavbar,
  Row,
  Switch,
  Text,
  useTheme,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useLocation, useNavigate } from "react-router-dom";

import { MoonIcon } from "../../components/MoonIcon";
import { SunIcon } from "../../components/SunIcon";
import MiniOrgInfo from "../Dashboard/CurrentUser/MiniOrgInfo";

export const ROUTES = {
  root: "/",
  apexConsole: "apex-console",
  debugging: "debug",
} as const;

function Navbar() {
  const { isDark } = useTheme();
  const { setTheme } = useNextTheme();
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  return (
    <NUINavbar isBordered variant="floating" css={{ zIndex: 10000 }}>
      <NUINavbar.Brand css={{ width: "100px" }}>
        <Text
          size={20}
          css={{
            textGradient: "45deg, $blue600 -20%, $green600 80%",
          }}
          weight="bold"
        >
          SF DevTools 🛠
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
      <NUINavbar.Content css={{ width: "180px", justifyContent: "flex-end" }}>
        <Row>
          <MiniOrgInfo />
          <Col
            css={{
              width: "auto",
            }}
          >
            <Switch
              checked={!isDark}
              onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
              bordered
              size="sm"
              color="success"
              iconOn={<SunIcon />}
              iconOff={<MoonIcon />}
            />
            <Row justify="center" css={{ mt: 5 }}>
              <Text size="xx-small" b>
                {isDark ? "DARK" : "LIGHT"}
              </Text>
            </Row>
          </Col>
        </Row>
      </NUINavbar.Content>
    </NUINavbar>
  );
}

export default Navbar;
