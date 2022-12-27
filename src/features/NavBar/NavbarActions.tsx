import { Dropdown, Row, Switch, Text, useTheme } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";

import { MoonIcon } from "../../components/icons/MoonIcon";
import { SunIcon } from "../../components/icons/SunIcon";
import { useZustand } from "../../hooks/useZustand";

function NavbarActions() {
  const { isDark } = useTheme();
  const { setTheme } = useNextTheme();

  const setSfdxPath = useZustand((state) => state.setSfdxPath);

  return (
    <Dropdown closeOnSelect={false} shouldCloseOnBlur>
      <Dropdown.Button
        flat
        color="primary"
        size="xs"
        css={{ fontSize: "x-small", fontWeight: "$bold", ml: 5 }}
      >
        SETUP
      </Dropdown.Button>
      <Dropdown.Menu color="primary" aria-label="Actions">
        <Dropdown.Item key="appearance">
          <Row justify="space-between">
            <Text>Toggle appearance</Text>
            <Switch
              checked={!isDark}
              onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
              bordered
              size="sm"
              color="success"
              iconOn={<SunIcon />}
              iconOff={<MoonIcon />}
            />
          </Row>
        </Dropdown.Item>
        <Dropdown.Item key="details">
          <Text
            onClick={() => {
              setSfdxPath("");
            }}
          >
            Set sfdx path
          </Text>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NavbarActions;
