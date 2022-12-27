import { useZustand } from "./hooks/useZustand";
import type {
  CurrentUserSuccessResponse,
  GetLogResponse,
  ListLimitsSuccessResponse,
  ListLogsResponse,
  ListOrgsSuccessResponse,
  RunAnonymousSuccessResponse,
  SfdxErrorResponse,
  SfdxResponse,
} from "./shared/sfdxResponses";
import sfdxResponses from "./shared/sfdxResponses";

const sfdxPath = useZustand.getState().sfdxPath;

async function selectFolder() {
  const res = await window?.api?.selectFolder("dialog:openDirectory");
  return res;
}

async function runAnonymous(apex: string) {
  const res = await window?.api?.runAnonymous("runAnonymous", sfdxPath, apex);
  return JSON.parse(res) as RunAnonymousSuccessResponse;
}

async function runSoql<T>(soql: string) {
  const res = await window?.api?.runSoql("runSoql", sfdxPath, soql);
  return JSON.parse(res) as T;
}

async function createRecord<T>(
  sObjectType: string,
  values: string,
  useToolingApi: boolean
) {
  const res = await window?.api?.createRecord(
    "createRecord",
    sfdxPath,
    sObjectType,
    values,
    useToolingApi
  );
  const parsed = JSON.parse(res);
  if (sfdxResponses.isSuccessResponse<T>(parsed)) {
    return parsed;
  } else {
    throw Error((parsed as SfdxErrorResponse).message);
  }
}

async function deleteRecord(
  sObjectType: string,
  id: string,
  useToolingApi: boolean
) {
  const res = await window?.api?.deleteRecord(
    "deleteRecord",
    sfdxPath,
    sObjectType,
    id,
    useToolingApi
  );
  return JSON.parse(res);
}

async function listLogs() {
  const res = await window?.api?.listLogs("listLogs", sfdxPath);
  const logsResponse = JSON.parse(res) as ListLogsResponse;

  return {
    ...logsResponse,
    result: logsResponse.result.reverse(),
  } as ListLogsResponse;
}

async function getLog(logId: string, logData: ListLogsResponse["result"][0]) {
  const res = await window?.api?.getLog("getLog", sfdxPath, logId);
  const parsedRes = JSON.parse(res);
  return { ...parsedRes, logData } as GetLogResponse;
}

async function bulkDeleteLogs() {
  await window?.api?.bulkDeleteLogs("bulkDeleteLogs", sfdxPath);
}

async function displayUser() {
  const res = await window?.api?.fetchCurrentUser("fetchCurrentUser", sfdxPath);
  return JSON.parse(res) as CurrentUserSuccessResponse;
}

async function setDefaultOrg(username: string) {
  await window?.api?.setDefaultOrg("setDefaultOrg", sfdxPath, username);
}

async function listLimits() {
  const res = await window?.api?.listLimits("listLimits", sfdxPath);
  return JSON.parse(res) as ListLimitsSuccessResponse;
}

async function listOrgs() {
  const res = await window?.api?.listOrgs("listOrgs", sfdxPath);
  const listOrgsRes = JSON.parse(res);
  return listOrgsRes as ListOrgsSuccessResponse;
}

async function setAliasForOrg(username: string, alias: string) {
  const res = await window?.api?.setAliasForOrg(
    "setAliasForOrg",
    sfdxPath,
    username,
    alias
  );

  const setAliasForOrgRes = JSON.parse(res) as SfdxResponse;
  if (setAliasForOrgRes.status === 0) return setAliasForOrgRes;
  else throw new Error("Error setting new alias");
}

async function openOrg(username: string) {
  await window?.api?.openOrg("openOrg", sfdxPath, username);
}

async function markScratchForDeletion(username: string) {
  await window?.api?.markScratchForDeletion(
    "markScratchForDeletion",
    sfdxPath,
    username
  );
}

const mainApi = {
  selectFolder,
  runAnonymous,
  runSoql,
  createRecord,
  deleteRecord,
  listLogs,
  getLog,
  bulkDeleteLogs,
  displayUser,
  setDefaultOrg,
  setAliasForOrg,
  listLimits,
  listOrgs,
  openOrg,
  markScratchForDeletion,
};
export default mainApi;
