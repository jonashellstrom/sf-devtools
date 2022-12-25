export type SoqlQueryOption = {
  sObject: string;
  plural: string;
};

export const LOCAL_STORAGE_KEY = "@sf-devtools-soql-helper-options";

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
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(options));
}
