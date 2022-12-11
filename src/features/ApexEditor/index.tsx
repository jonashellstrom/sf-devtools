import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Loading,
  Row,
  Text,
} from "@nextui-org/react";
import { useState } from "react";

import useWithCopyToClipboard from "../../hooks/useWithCopyToClipboard";
import mainApi from "../../mainApi";
import utils from "../../shared/utils";
import CodeEditor from "./CodeEditor";
import SoqlHelper from "./SoqlHelper/SoqlHelper";
import useDebouncedSaveToLocalStorage from "../../hooks/useDebouncedSaveToLocalStorage";
import { useMutation } from "@tanstack/react-query";

const LOCAL_STORAGE_KEY = "@sf-devtools-apex-editor";
const PLACEHOLDER_APEX = `final String greeting = 'Hello world!';\nSystem.debug(greeting);`;

const getInitialCode = () =>
  localStorage.getItem(LOCAL_STORAGE_KEY) || PLACEHOLDER_APEX;

function ApexEditor() {
  const [code, setCode] = useState<string>(getInitialCode);
  const [output, setOutput] = useState<string>();
  const [shouldShowRawOutput, setShouldShowRawOutput] = useState(false);

  useDebouncedSaveToLocalStorage(LOCAL_STORAGE_KEY, code);

  const { handleOnPress, CopyToClipboardWrapper } = useWithCopyToClipboard();

  const { mutate: runAnonymous, isLoading } = useMutation(
    mainApi.runAnonymous,
    {
      onMutate: () => {
        setOutput("Running ...");
      },
      onError: (_error, _variables, _context) => {
        setOutput(`⛔️ Something went wrong...`);
      },
      onSettled(data) {
        if (data.result.success) {
          if (shouldShowRawOutput) setOutput(data.result.logs);
          else setOutput(utils.getOnlyDebugLogLines(data.result.logs));
        } else if (!data.result.compiled) {
          setOutput(`⛔️ Compile error: ${data.result.compileProblem}`);
        } else {
          setOutput(
            `⛔️ ${data.result.exceptionMessage}\n🔖 ${data.result.exceptionStackTrace}`
          );
        }
      },
    }
  );

  return (
    <Container css={{ pt: 30 }}>
      <Row justify="space-between">
        <Text h5 b>
          Apex Editor
        </Text>
      </Row>
      <CodeEditor
        code={code}
        setCode={setCode}
        language="apex"
        placeholder="Write your anonymous Apex here!"
        minHeight={330}
      />
      <Row justify="space-between" css={{ pb: 15 }}>
        <Row>
          <Button
            onPress={() => runAnonymous(code)}
            disabled={isLoading}
            auto
            css={{
              mr: 10,
              borderRadius: 5,
            }}
            size="sm"
          >
            {isLoading ? (
              <Loading color="currentColor" size="sm" type="points" />
            ) : (
              <>
                <Text color="white" b>
                  Run
                </Text>
                <Text color="white" b css={{ ml: 5 }}>
                  ▶️
                </Text>
              </>
            )}
          </Button>
          <CopyToClipboardWrapper>
            <Button
              flat
              onPress={async () => await handleOnPress(code)}
              color="primary"
              auto
              css={{ mr: 10, borderRadius: 5 }}
              size="sm"
            >
              Copy
            </Button>
          </CopyToClipboardWrapper>
          <SoqlHelper appendCode={(query) => setCode((c) => c + query)} />
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
            onChange={setShouldShowRawOutput}
          >
            <Text size={14}>Show raw logs</Text>
          </Checkbox>
          <Button
            flat
            onPress={() => setOutput("")}
            color="error"
            auto
            size="sm"
          >
            Clear
          </Button>
        </Row>
        {isLoading && (
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
    </Container>
  );
}

export default ApexEditor;
