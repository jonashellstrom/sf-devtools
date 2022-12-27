import create from "zustand";
import { devtools } from "zustand/middleware";

import { LOCAL_STORAGE_KEYS } from "../shared/constants";

type AppState = {
  sfdxPath: string;
  code: string;
  output: string;
  isEditorExpanded: boolean;
  shouldShowRawOutput: boolean;
  isRunCodeLoading: boolean;
};

type AppStateWithActions = AppState & {
  setSfdxPath: (path: string) => void;
  getCode: () => string;
  setCode: (code: string) => void;
  setOutput: (output: string) => void;
  toggleIsEditorExpanded: () => void;
  toggleShouldShowRawOutput: () => void;
  toggleIsRunCodeLoading: (v: boolean) => void;
};

const PLACEHOLDER_APEX = `final String greeting = 'Hello world!';\nSystem.debug(greeting);`;

const getInitialSfdxPath = () =>
  localStorage.getItem(LOCAL_STORAGE_KEYS.SFDX_PATH) || "";
const getInitialCode = () =>
  localStorage.getItem(LOCAL_STORAGE_KEYS.CODE) || PLACEHOLDER_APEX;
const getInitialOutput = () =>
  localStorage.getItem(LOCAL_STORAGE_KEYS.CODE_OUTPUT) || "";
const getInitialIsEditorExpanded = () =>
  localStorage.getItem(LOCAL_STORAGE_KEYS.EDITOR_IS_EXPANDED) === "true" ||
  false;
const getInitialIsOutputRaw = () =>
  localStorage.getItem(LOCAL_STORAGE_KEYS.EDITOR_OUTPUT_IS_RAW) === "true" ||
  false;

const initialStore: AppState = {
  sfdxPath: getInitialSfdxPath(),
  code: getInitialCode(),
  output: getInitialOutput(),
  isEditorExpanded: getInitialIsEditorExpanded(),
  shouldShowRawOutput: getInitialIsOutputRaw(),
  isRunCodeLoading: false,
};

export const useZustand = create<AppStateWithActions>()(
  devtools((set, get) => ({
    ...initialStore,
    setSfdxPath(sfdxPath) {
      set(() => ({
        sfdxPath,
      }));
    },
    getCode() {
      const { code } = get();
      return code;
    },
    setCode(code) {
      set(() => ({
        code,
      }));
    },
    setOutput(output) {
      set(() => ({
        output,
      }));
    },
    toggleIsEditorExpanded() {
      set((state) => ({
        isEditorExpanded: !state.isEditorExpanded,
      }));
    },
    toggleShouldShowRawOutput() {
      set((state) => ({
        shouldShowRawOutput: !state.shouldShowRawOutput,
      }));
    },
    toggleIsRunCodeLoading(v: boolean) {
      set((state) => ({
        isRunCodeLoading: v,
      }));
    },
  }))
);
