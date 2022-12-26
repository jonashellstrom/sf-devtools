const DEBUG_REGEX = /\|DEBUG\|(.*)[\n\r]/g;
const DEBUG_AND_ERROR_REGEX = /\|(DEBUG|ERROR)\|(.*)[\n\r]/g;

function getOnlyDebugAndErrorLogLines(rawLogs: string) {
  const matchingLines = [...rawLogs.matchAll(DEBUG_AND_ERROR_REGEX)].map(
    ([_, match, matchValue]) => {
      if (match === "ERROR") return `⛔️ ${match}: ${matchValue}`;
      else return `${matchValue}`;
    }
  );
  return matchingLines.join("\n\n");
}

const utils = {
  getOnlyDebugAndErrorLogLines,
};

export default utils;
