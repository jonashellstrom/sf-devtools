import type {
  GetLogResponse,
  ListLimitsSuccessResponse,
  ListLogsResponse,
  ListOrgsSuccessResponse,
  SfdxErrorResponse,
} from "./shared/sfdxResponses";
import sfdxResponses from "./shared/sfdxResponses";

async function runAnonymous(apex: string) {
  const res = await window?.api?.sendApex("apexToMainWithOutput", apex);
  return JSON.parse(res);
}

async function runSoql<T>(soql: string) {
  const res = await window?.api?.sendSoql("soqlToMainWithOutput", soql);
  return JSON.parse(res) as T;
}

async function createRecord<T>(
  sObjectType: string,
  values: string,
  useToolingApi: boolean
) {
  const res = await window?.api?.createRecord(
    "recordCreateToMainWithOutput",
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
    "recordDeleteToMainWithOutput",
    sObjectType,
    id,
    useToolingApi
  );
  return JSON.parse(res);
}

async function listLogs() {
  const res = await window?.api?.listLogs("listLogsToMainWithOutput");
  const logsResponse = JSON.parse(res) as ListLogsResponse;

  return {
    ...logsResponse,
    result: logsResponse.result.reverse(),
  } as ListLogsResponse;
}

async function getLog(logId: string, logData: ListLogsResponse["result"][0]) {
  const res = await window?.api?.getLog("getLogToMainWithOutput", logId);
  const parsedRes = JSON.parse(res);
  return { ...parsedRes, logData } as GetLogResponse;
}

async function bulkDeleteLogs() {
  await window?.api?.bulkDeleteLogs("bulkDeleteApexLogs");
}

async function displayUser() {
  const res = await window?.api?.fetchCurrentUser("fetchCurrentUser");
  return JSON.parse(res);
}

async function setDefaultOrg(username: string) {
  await window?.api?.setDefaultOrg("setDefaultOrg", username);
}

async function listLimits() {
  const res = await window?.api?.listLimits("listLimits");
  return JSON.parse(res) as ListLimitsSuccessResponse;
}

async function listOrgs() {
  const res = await window?.api?.listOrgs("listOrgs");
  const listOrgsRes = JSON.parse(res);
  return listOrgsRes as ListOrgsSuccessResponse;
}

async function setAliasForOrg(username: string, alias: string) {
  await window?.api?.setAliasForOrg("setAliasForOrg", username, alias);
}

async function openOrg(username: string) {
  await window?.api?.openOrg("openOrg", username);
}

async function markScratchForDeletion(username: string) {
  await window?.api?.markScratchForDeletion("markScratchForDeletion", username);
}

const mainApi = {
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
