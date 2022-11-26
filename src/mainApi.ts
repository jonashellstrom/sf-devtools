async function runAnonymous(apex: string) {
  const res = await window?.api?.sendApex("apexToMainWithOutput", apex);
  return JSON.parse(res);
}

const mainApi = {
  runAnonymous,
};
export default mainApi;
