import { Button, Checkbox, Loading, Row, Text } from "@nextui-org/react";
import shallow from "zustand/shallow";

import useDebouncedSaveToLocalStorage from "../../../hooks/useDebouncedSaveToLocalStorage";
import { useZustand } from "../../../hooks/useZustand";
import { LOCAL_STORAGE_KEYS } from "../../../shared/constants";
import CodeEditor from "../CodeEditor";

function ApexEditorOutput() {
  const [output, setOutput] = useZustand(
    (state) => [state.output, state.setOutput],
    shallow
  );
  const [shouldShowRawOutput, toggleShouldShowRawOutput] = useZustand(
    (state) => [state.shouldShowRawOutput, state.toggleShouldShowRawOutput],
    shallow
  );
  const isRunCodeLoading = useZustand((state) => state.isRunCodeLoading);

  useDebouncedSaveToLocalStorage(LOCAL_STORAGE_KEYS.CODE_OUTPUT, output, 0);
  useDebouncedSaveToLocalStorage(
    LOCAL_STORAGE_KEYS.EDITOR_OUTPUT_IS_RAW,
    `${shouldShowRawOutput}`,
    0
  );

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <CodeEditor
        code={output}
        language="bash"
        placeholder="Your output will show up here!"
        isDisabled
        minHeight={200}
      />
      <Row justify="space-between" css={{ mb: 15 }}>
        <Checkbox
          isSelected={shouldShowRawOutput}
          onChange={toggleShouldShowRawOutput}
        >
          <Text size={14}>Show raw logs</Text>
        </Checkbox>
        <Button flat onPress={() => setOutput("")} color="error" auto size="sm">
          Clear
        </Button>
      </Row>
      {isRunCodeLoading && (
        <Loading
          color="secondary"
          type="points"
          size="lg"
          css={{
            position: "absolute",
            bottom: 75,
            right: 25,
            opacity: 0.75,
          }}
        />
      )}
    </div>
  );
}

export default ApexEditorOutput;
