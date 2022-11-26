import {
  Image,
  Navbar as NUINavbar,
  Switch,
  Text,
  useTheme,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useLocation, useNavigate } from "react-router-dom";

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
    <NUINavbar isBordered variant="sticky">
      <NUINavbar.Brand>
        <Image src="/astro.png" alt="logo" height={60} />
        <Text b color="inherit" hideIn="xs" style={{ paddingLeft: 10 }}>
          DevTools
        </Text>
      </NUINavbar.Brand>
      <NUINavbar.Content
        enableCursorHighlight
        activeColor="primary"
        hideIn="xs"
        variant="highlight-rounded"
      >
        <NUINavbar.Link
          isActive={currentPath === "/"}
          onClick={() => navigate(ROUTES.root)}
        >
          Dashboard
        </NUINavbar.Link>
        <NUINavbar.Link
          isActive={currentPath === "/apex-console"}
          onPress={() => navigate(ROUTES.apexConsole)}
        >
          Apex Console
        </NUINavbar.Link>
        <NUINavbar.Link
          isActive={currentPath === "/debug"}
          onPress={() => navigate(ROUTES.debugging)}
        >
          Debugging
        </NUINavbar.Link>
      </NUINavbar.Content>
      <Switch
        checked={isDark}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
      />
    </NUINavbar>
  );
}

export default Navbar;
