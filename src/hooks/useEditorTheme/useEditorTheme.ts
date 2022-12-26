import { useEffect, useState } from "react";

import useDebouncedSaveToLocalStorage from "../../hooks/useDebouncedSaveToLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../../shared/constants";

require("./editor-theme.css");

export enum Theme {
  GITHUB = "GITHUB",
  NIGHT_OWL = "NIGHT_OWL",
}

const TEXT_EDITOR_CSS_CLASS_NAME = "w-tc-editor-preview";
const THEME_CLASS_NAMES = {
  GITHUB: "github-theme",
  NIGHT_OWL: "night-owl-theme",
};

function getInitialTheme() {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.EDITOR_THEME) || Theme.GITHUB;
}

function useEditorTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useDebouncedSaveToLocalStorage(LOCAL_STORAGE_KEYS.EDITOR_THEME, theme, 0);

  useEffect(() => {
    const editorElement = document.getElementsByClassName(
      TEXT_EDITOR_CSS_CLASS_NAME
    );
    for (const el of editorElement) {
      if (theme === Theme.GITHUB) {
        el.classList.add(THEME_CLASS_NAMES.GITHUB);
        el.classList.remove(THEME_CLASS_NAMES.NIGHT_OWL);
      } else {
        el.classList.add(THEME_CLASS_NAMES.NIGHT_OWL);
        el.classList.remove(THEME_CLASS_NAMES.GITHUB);
      }
    }
  }, [theme]);

  return { themes: Theme, currentTheme: theme, setTheme };
}

export default useEditorTheme;
