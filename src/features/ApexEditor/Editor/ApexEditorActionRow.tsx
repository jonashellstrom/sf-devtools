import { Button, Dropdown, Loading, Row, Text } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { memo } from "react";
import shallow from "zustand/shallow";

import useWithCopyToClipboard from "../../../hooks/useWithCopyToClipboard";
import { useZustand } from "../../../hooks/useZustand";
import mainApi from "../../../mainApi";
import utils from "../../../shared/utils";
import SoqlHelper from "../SoqlHelper/SoqlHelper";

function ApexEditorActionRow() {
  const [getCode, setCode, setOutput, toggleIsRunCodeLoading] = useZustand(
    (state) => [
      state.getCode,
      state.setCode,
      state.setOutput,
      state.toggleIsRunCodeLoading,
    ],
    shallow
  );
  const shouldShowRawOutput = useZustand(
    (state) => state.shouldShowRawOutput,

    shallow
  );

  const { mutate, isLoading } = useMutation(
    () => mainApi.runAnonymous(getCode()),
    {
      onMutate: () => {
        toggleIsRunCodeLoading(true);
        setOutput("Running ...");
      },
      onError: (_error, _variables, _context) => {
        toggleIsRunCodeLoading(false);
        setOutput(`⛔️ Something went wrong...`);
      },
      onSuccess(data) {
        toggleIsRunCodeLoading(false);
        if (data.result.success) {
          if (shouldShowRawOutput) setOutput(data.result.logs);
          else setOutput(utils.getOnlyDebugAndErrorLogLines(data.result.logs));
        } else if (!data.result.compiled) {
          setOutput(
            `⛔️ Compile error on line ${data.result.line}: ${data.result.compileProblem}`
          );
        } else {
          setOutput(
            `⛔️ ${data.result.exceptionMessage}\n🔖 ${data.result.exceptionStackTrace}`
          );
        }
      },
    }
  );

  const { handleOnCopyPress, CopyToClipboardWrapper } =
    useWithCopyToClipboard();

  return (
    <Row justify="space-between" css={{ pb: 15 }}>
      <Row>
        <Button
          onPress={() => mutate()}
          disabled={isLoading}
          auto
          css={{
            mr: 10,
            borderRadius: 5,
            minWidth: "75px",
          }}
          size="sm"
        >
          {isLoading ? (
            <Loading color="currentColor" size="sm" type="points" />
          ) : (
            <>
              <Text color="currentColor" b>
                Run ▶️
              </Text>
            </>
          )}
        </Button>
        <CopyToClipboardWrapper>
          <Button
            flat
            onPress={() => handleOnCopyPress(getCode())}
            color="primary"
            auto
            css={{ mr: 10, borderRadius: 5 }}
            size="sm"
          >
            Copy
          </Button>
        </CopyToClipboardWrapper>
        <SoqlHelper appendCode={(query) => setCode(getCode() + query)} />
      </Row>
      <Row justify="flex-end">
        <Dropdown isBordered>
          <Dropdown.Button
            flat
            color="error"
            size="sm"
            css={{ borderRadius: 5 }}
          >
            Clear
          </Dropdown.Button>
          <Dropdown.Menu aria-label="Static Actions">
            <Dropdown.Item
              key="clear-input"
              textValue="clear input"
              color="error"
            >
              <Text color="error" onClick={() => setCode("")}>
                Clear all input
              </Text>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Row>
    </Row>
  );
}

const Memoized = memo(ApexEditorActionRow);
export default Memoized;
