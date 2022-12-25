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
import useEditorTheme from "../../hooks/useEditorTheme/useEditorTheme";

const CODE_LOCAL_STORAGE_KEY = "@sf-devtools-apex-editor";
const OUTPUT_LOCAL_STORAGE_KEY = "@sf-devtools-apex-editor-output";
const IS_EXPANDED_LOCAL_STORAGE_KEY = "@sf-devtools-apex-editor-is-expanded";

const PLACEHOLDER_APEX = `final String greeting = 'Hello world!';\nSystem.debug(greeting);`;

const getInitialCode = () =>
  localStorage.getItem(CODE_LOCAL_STORAGE_KEY) || PLACEHOLDER_APEX;
const getInitialOutput = () =>
  localStorage.getItem(OUTPUT_LOCAL_STORAGE_KEY) || "";
const getInitialIsEditorExpanded = () =>
  localStorage.getItem(IS_EXPANDED_LOCAL_STORAGE_KEY) === "true" || false;

function ApexEditor() {
  const [code, setCode] = useState<string>(getInitialCode);
  const [output, setOutput] = useState<string>(getInitialOutput);
  const [shouldShowRawOutput, setShouldShowRawOutput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(getInitialIsEditorExpanded);

  useDebouncedSaveToLocalStorage(CODE_LOCAL_STORAGE_KEY, code, 2000);
  useDebouncedSaveToLocalStorage(OUTPUT_LOCAL_STORAGE_KEY, output, 0);
  useDebouncedSaveToLocalStorage(
    IS_EXPANDED_LOCAL_STORAGE_KEY,
    `${isExpanded}`,
    1000
  );

  const { handleOnPress, CopyToClipboardWrapper } = useWithCopyToClipboard();

  const { mutate: runAnonymous, isLoading } = useMutation(
    () => mainApi.runAnonymous(code),
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

  const { themes, currentTheme, setTheme } = useEditorTheme();

  return (
    <Container css={{ pt: 20 }}>
      <Row justify="space-between">
        <Text h5 b>
          Apex Editor
        </Text>
        <Button
          size="xs"
          auto
          css={{ fontSize: "x-small", fontWeight: "$bold", minWidth: "77px" }}
          flat
          onPress={() => {
            setTheme(
              currentTheme === themes.GITHUB ? themes.NIGHT_OWL : themes.GITHUB
            );
          }}
        >
          THEME
        </Button>
        <Button
          size="xs"
          auto
          css={{ fontSize: "x-small", fontWeight: "$bold", minWidth: "77px" }}
          flat
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "COLLAPSE" : "EXPAND"}
        </Button>
      </Row>
      <CodeEditor
        code={code}
        setCode={setCode}
        language="apex"
        placeholder="Write your anonymous Apex here!"
        minHeight={isExpanded ? 600 : 330}
      />
      <Row justify="space-between" css={{ pb: 15 }}>
        <Row>
          <Button
            onPress={() => runAnonymous()}
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
