import { GetLogResponse, ListLogsResponse } from "./shared/sfdxResponses";

async function runAnonymous(apex: string) {
  const res = await window?.api?.sendApex("apexToMainWithOutput", apex);
  return JSON.parse(res);
}

async function runSoql<T>(soql: string) {
  const res = await window?.api?.sendSoql("soqlToMainWithOutput", soql);
  return JSON.parse(res) as T;
}

async function createRecord(
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
  return JSON.parse(res);
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
  return JSON.parse(res) as ListLogsResponse;
}

async function getLog(logId: string) {
  const res = await window?.api?.getLog("getLogToMainWithOutput", logId);
  return JSON.parse(res) as GetLogResponse;
}

const mainApi = {
  runAnonymous,
  runSoql,
  createRecord,
  deleteRecord,
  listLogs,
  getLog,
};
export default mainApi;
