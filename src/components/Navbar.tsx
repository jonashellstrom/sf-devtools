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
import CurrentUser from "../features/CurrentUser";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

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
    <NUINavbar isBordered variant="floating">
      <NUINavbar.Brand css={{ width: "100px" }}>
        <Text b color="inherit" hideIn="xs" style={{ paddingLeft: 10 }}>
          DevTools
        </Text>
      </NUINavbar.Brand>
      <NUINavbar.Content
        enableCursorHighlight
        activeColor="secondary"
        hideIn="xs"
        variant="underline"
      >
        <NUINavbar.Link
          isActive={currentPath === "/"}
          onClick={() => navigate(ROUTES.root)}
        >
          Dashboard
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
      <NUINavbar.Content css={{ width: "100px", justifyContent: "flex-end" }}>
        <CurrentUser />
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
      </NUINavbar.Content>
    </NUINavbar>
  );
}

export default Navbar;
