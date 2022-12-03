import { Loading, useTheme } from "@nextui-org/react";
import ReactCodeEditor, {
  TextareaCodeEditorProps,
} from "@uiw/react-textarea-code-editor";

type CodeEditorProps = {
  code: string | undefined;
  placeholder: string;
  language: TextareaCodeEditorProps["language"];
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
  if (isDark) document.documentElement.setAttribute("data-color-mode", "dark");
  else document.documentElement.setAttribute("data-color-mode", "light");

  return (
    <div
      style={{
        ...editorContainerStyle,
        height: `${minHeight + 1}px`,
        position: "relative",
      }}
    >
      <ReactCodeEditor
        value={code}
        language={language}
        placeholder={placeholder}
        onChange={setCode && ((e) => setCode(e.target.value))}
        disabled={isDisabled}
        padding={20}
        minHeight={minHeight}
        style={{
          background: undefined,
          whiteSpace: "normal",
          fontSize: 14,
          borderRadius: 10,
          fontFamily:
            "JetBrains Mono,ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
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
  );
}

export default CodeEditor;