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
};

function CodeEditor({
  code,
  placeholder,
  language,
  setCode,
  isLoading,
  isDisabled,
}: CodeEditorProps) {
  const { isDark } = useTheme();
  if (isDark) document.documentElement.setAttribute("data-color-mode", "dark");
  else document.documentElement.setAttribute("data-color-mode", "light");

  return (
    <div
      style={{
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
        minHeight={150}
        style={{
          border: "0.5px solid grey",
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
