import { useEffect, useState } from "react";
import useDebouncedSaveToLocalStorage from "../../hooks/useDebouncedSaveToLocalStorage";

require("./editor-theme.css");

export enum Theme {
  GITHUB = "GITHUB",
  NIGHT_OWL = "NIGHT_OWL",
}

const LOCAL_STORAGE_KEY = "@sf-devtools-editor-theme";

function getInitialTheme() {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || Theme.GITHUB;
}
function useEditorTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useDebouncedSaveToLocalStorage(LOCAL_STORAGE_KEY, theme, 0);

  useEffect(() => {
    const editorElement = document.getElementsByClassName(
      "w-tc-editor-preview"
    );
    for (const el of editorElement) {
      if (theme === Theme.GITHUB) {
        el.classList.add("github-theme");
        el.classList.remove("night-owl-theme");
      } else {
        el.classList.add("night-owl-theme");
        el.classList.remove("github-theme");
      }
    }
  }, [theme]);

  return { themes: Theme, currentTheme: theme, setTheme };
}

export default useEditorTheme;
