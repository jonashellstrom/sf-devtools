import {
  Button,
  Container,
  Dropdown,
  Loading,
  Row,
  Text,
} from "@nextui-org/react";
import { useState } from "react";
import { useMutation } from "react-query";

import useWithCopyToClipboard from "../../hooks/useWithCopyToClipboard";
import mainApi from "../../mainApi";
import utils from "../../shared/utils";
import CodeEditor from "./CodeEditor";
import SoqlHelper from "./SoqlHelper";
import useDebouncedSaveToLocalStorage from "../../hooks/useDebouncedSaveToLocalStorage";

const LOCAL_STORAGE_KEY = "@sf-devtools-apex-editor";
const PLACEHOLDER_APEX = `final String greeting = 'Hello world!';\nSystem.debug(greeting);`;

const getInitialCode = () =>
  localStorage.getItem(LOCAL_STORAGE_KEY) || PLACEHOLDER_APEX;

function ApexEditor() {
  const [code, setCode] = useState<string>(getInitialCode);
  const [output, setOutput] = useState<string>();

  useDebouncedSaveToLocalStorage(LOCAL_STORAGE_KEY, code);

  const { handleOnPress, CopyToClipboardWrapper } = useWithCopyToClipboard();

  const { mutate: runAnonymous, isLoading } = useMutation(
    mainApi.runAnonymous,
    {
      onMutate: () => {
        setOutput("LOADING...");
      },
      onError: (error, _variables, _context) => {
        console.error("uh oh: ", { error });
      },
      onSettled(data, _error, _variables, _context) {
        if (data.result.success) {
          setOutput(utils.getOnlyDebugLogLines(data.result.logs));
        }
      },
    }
  );

  return (
    <Container css={{ pt: 30 }}>
      <Text h4 b>
        Anonymous Apex
      </Text>
      <CodeEditor
        code={code}
        setCode={setCode}
        language="apex"
        placeholder="Write your anonymous Apex here!"
      />
      <Row justify="space-between" css={{ pb: 15 }}>
        <Row>
          <Button
            flat
            onPress={() => runAnonymous(code)}
            disabled={isLoading}
            auto
            css={{ mr: 10 }}
            size="sm"
          >
            {isLoading ? (
              <Loading color="currentColor" size="sm" type="points" />
            ) : (
              "Run"
            )}
          </Button>
          <CopyToClipboardWrapper>
            <Button
              flat
              onPress={async () => await handleOnPress(code)}
              color="warning"
              auto
              css={{ mr: 10 }}
              size="sm"
            >
              Copy
            </Button>
          </CopyToClipboardWrapper>
          <SoqlHelper appendCode={(query) => setCode((c) => c + query)} />
        </Row>
        <Row justify="flex-end">
          <Dropdown>
            <Dropdown.Button flat color="error" size="sm">
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
      <Text h4 b>
        Output
      </Text>
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
        />
        {isLoading && (
          <Loading
            color="currentColor"
            type="points"
            size="lg"
            css={{
              position: "absolute",
              bottom: 30,
              right: 25,
              opacity: 0.5,
            }}
          />
        )}
      </div>
    </Container>
  );
}

export default ApexEditor;
