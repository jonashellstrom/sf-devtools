import { Button, Container, Row, Text } from "@nextui-org/react";
import shallow from "zustand/shallow";

import useDebouncedSaveToLocalStorage from "../../hooks/useDebouncedSaveToLocalStorage";
import useEditorTheme from "../../hooks/useEditorTheme/useEditorTheme";
import { useZustand } from "../../hooks/useZustand";
import { LOCAL_STORAGE_KEYS } from "../../shared/constants";
import ApexBookmarks from "./ApexBookmarks/ApexBookmarks";
import ApexEditorContainer from "./Editor/ApexEditorContainer";

function ApexEditor() {
  const toggleIsEditorExpanded = useZustand(
    (state) => state.toggleIsEditorExpanded,
    shallow
  );
  const isEditorExpanded = useZustand((state) => state.isEditorExpanded);
  const { themes, currentTheme, setTheme } = useEditorTheme();

  useDebouncedSaveToLocalStorage(
    LOCAL_STORAGE_KEYS.EDITOR_IS_EXPANDED,
    `${isEditorExpanded}`,
    1000
  );

  return (
    <Container css={{ pt: 20 }}>
      <Row justify="space-between">
        <Row justify="flex-start">
          <Text h5 b css={{ mr: 10 }}>
            Apex Editor
          </Text>
          <ApexBookmarks />
        </Row>
        <Row justify="flex-end" align="center">
          <Button
            size="xs"
            auto
            css={{ fontSize: "x-small", fontWeight: "$bold", minWidth: "77px" }}
            flat
            onPress={() => {
              setTheme(
                currentTheme === themes.GITHUB
                  ? themes.NIGHT_OWL
                  : themes.GITHUB
              );
            }}
          >
            THEME
          </Button>
          <Button
            size="xs"
            auto
            css={{
              fontSize: "x-small",
              fontWeight: "$bold",
              minWidth: "77px",
              ml: 10,
            }}
            flat
            onPress={() => toggleIsEditorExpanded()}
          >
            {isEditorExpanded ? "COLLAPSE" : "EXPAND"}
          </Button>
        </Row>
      </Row>
      <ApexEditorContainer />
    </Container>
  );
}

export default ApexEditor;
