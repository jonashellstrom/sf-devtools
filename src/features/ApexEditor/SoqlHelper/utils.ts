import { LOCAL_STORAGE_KEYS } from "../../../shared/constants";

export type SoqlQueryOption = {
  sObject: string;
  plural: string;
};

export const SOQL_QUERY_OPTIONS: SoqlQueryOption[] = [
  {
    sObject: "User",
    plural: "Users",
  },
  {
    sObject: "Account",
    plural: "Accounts",
  },
  {
    sObject: "Contact",
    plural: "Contacts",
  },
];

export function setOptionsInLocalStorage(options: readonly SoqlQueryOption[]) {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.SOQL_OPTIONS,
    JSON.stringify(options)
  );
}
