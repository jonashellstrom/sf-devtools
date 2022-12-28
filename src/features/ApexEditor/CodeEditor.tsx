import { Loading, useTheme } from "@nextui-org/react";
import ReactCodeEditor, {
  TextareaCodeEditorProps,
} from "@uiw/react-textarea-code-editor";

const COLOR_MODE_ATTRIBUTE = "data-color-mode";

type CodeEditorProps = {
  code: string;
  placeholder: string;
  language?: TextareaCodeEditorProps["language"];
  setCode?: (code: string) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  minHeight?: number;
};

const editorContainerStyle = {
  overflow: "scroll",
  border: "0.5px solid grey",
  borderRadius: 10,
  marginBottom: 15,
};

function CodeEditor({
  code,
  placeholder,
  language,
  setCode,
  isLoading,
  isDisabled,
  minHeight = 270,
}: CodeEditorProps) {
  const { isDark } = useTheme();

  document.documentElement.setAttribute(
    COLOR_MODE_ATTRIBUTE,
    isDark ? "dark" : "light"
  );

  const shouldUnsetLanguageParsingForPerformanceOptimization =
    code.length > 8_000;

  return (
    <div
      style={{
        ...editorContainerStyle,
        height: `${minHeight + 1}px`,
        position: "relative",
        borderColor: "#bbb",
      }}
    >
      <ReactCodeEditor
        value={code}
        language={
          shouldUnsetLanguageParsingForPerformanceOptimization
            ? undefined
            : language
        }
        placeholder={placeholder}
        onChange={setCode && ((e) => setCode(e.target.value))}
        disabled={isDisabled}
        padding={20}
        minHeight={minHeight}
        style={{
          background: undefined,
          whiteSpace: "normal",
          fontSize: 12,
          borderRadius: 10,
          fontFamily:
            "JetBrains Mono,ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      {isLoading && (
        <Loading
          color="secondary"
          type="points"
          size="lg"
          css={{
            position: "absolute",
            bottom: 30,
            right: 25,
            opacity: 0.75,
          }}
        />
      )}
    </div>
  );
}

export default CodeEditor;
