import { useCallback, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

function useDebouncedSaveToLocalStorage(
  localStorageKey: string,
  value: string,
  debounceDelay: number = 3000
) {
  const changeHandler = useCallback(() => {
    console.log("saving to local storage now!");
    localStorage.setItem(localStorageKey, value);
  }, [localStorageKey, value]);

  const debouncedSaveToLocalStorage = useMemo(
    () => debounce(changeHandler, debounceDelay),
    [changeHandler, debounceDelay]
  );

  useEffect(() => {
    debouncedSaveToLocalStorage();
    return () => {
      debouncedSaveToLocalStorage.cancel();
    };
  }, [debouncedSaveToLocalStorage]);

  return { debouncedSaveToLocalStorage };
}

export default useDebouncedSaveToLocalStorage;
