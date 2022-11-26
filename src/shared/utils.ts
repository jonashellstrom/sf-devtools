const DEBUG_REGEX = /\|DEBUG\|(.*)[\n\r]/g;

function getOnlyDebugLogLines(rawLogs: string) {
  const matchingLines = [...rawLogs.matchAll(DEBUG_REGEX)].map(
    ([_, match]) => match
  );
  return matchingLines.join("\n");
}

const utils = {
  getOnlyDebugLogLines,
};

export default utils;
