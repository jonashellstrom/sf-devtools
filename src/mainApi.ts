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

const mainApi = {
  runAnonymous,
  runSoql,
  createRecord,
};
export default mainApi;
