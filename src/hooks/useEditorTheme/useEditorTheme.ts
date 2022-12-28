import { useEffect, useState } from "react";

import useDebouncedSaveToLocalStorage from "../../hooks/useDebouncedSaveToLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../../shared/constants";

require("./editor-theme.css");

const TEXT_EDITOR_CSS_CLASS_NAME = "w-tc-editor-preview";

export enum Theme {
  GITHUB = "GITHUB",
  NIGHT_OWL = "NIGHT OWL",
  AYU = "AYU",
}

const THEME_CLASS_NAMES: { [k in Theme]: string } = {
  [Theme.GITHUB]: "github-theme",
  [Theme.NIGHT_OWL]: "night-owl-theme",
  [Theme.AYU]: "ayu-theme",
};

function getInitialTheme() {
  return (
    (localStorage.getItem(LOCAL_STORAGE_KEYS.EDITOR_THEME) as Theme) ||
    Theme.GITHUB
  );
}

function setClassesForElement(el: Element, theme: Theme) {
  el.classList.remove(THEME_CLASS_NAMES.GITHUB);
  el.classList.remove(THEME_CLASS_NAMES["NIGHT OWL"]);
  el.classList.remove(THEME_CLASS_NAMES.AYU);
  el.classList.add(THEME_CLASS_NAMES[theme]);
}

function useEditorTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useDebouncedSaveToLocalStorage(LOCAL_STORAGE_KEYS.EDITOR_THEME, theme, 0);

  useEffect(() => {
    const editorElement = document.getElementsByClassName(
      TEXT_EDITOR_CSS_CLASS_NAME
    );
    for (const el of editorElement) {
      setClassesForElement(el, theme);
    }
  }, [theme]);

  return { themes: Theme, currentTheme: theme, setTheme };
}

export default useEditorTheme;

export function getNextTheme(currentTheme: Theme) {
  switch (currentTheme) {
    case Theme.GITHUB:
      return Theme.AYU;
    case Theme.AYU:
      return Theme.NIGHT_OWL;
    default:
      return Theme.GITHUB;
  }
}
