import fixtures from "./features/ScratchView/fixtures";
import type {
  GetLogResponse,
  ListLogsResponse,
  SfdxErrorResponse,
} from "./shared/sfdxResponses";
import sfdxResponses from "./shared/sfdxResponses";

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}
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

async function listOrgs() {
  await timeout(1000);
  return fixtures.LIST_ORGS_RESPONSE;
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
  listOrgs,
};
export default mainApi;
