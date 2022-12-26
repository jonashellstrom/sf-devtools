import shallow from "zustand/shallow";

import useDebouncedSaveToLocalStorage from "../../../hooks/useDebouncedSaveToLocalStorage";
import { useZustand } from "../../../hooks/useZustand";
import { LOCAL_STORAGE_KEYS } from "../../../shared/constants";
import CodeEditor from "../CodeEditor";

function ApexEditor() {
  const [code, setCode] = useZustand(
    (state) => [state.code, state.setCode],
    shallow
  );
  const isEditorExpanded = useZustand(
    (state) => state.isEditorExpanded,
    shallow
  );

  useDebouncedSaveToLocalStorage(LOCAL_STORAGE_KEYS.CODE, code, 2000);

  return (
    <CodeEditor
      code={code}
      setCode={setCode}
      language="apex"
      placeholder="Write your anonymous Apex here!"
      minHeight={isEditorExpanded ? 600 : 330}
    />
  );
}

export default ApexEditor;
