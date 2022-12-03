import { ProgressProps } from "@nextui-org/react";
import { DateTime } from "luxon";
import { type TraceFlag } from "./types";

function getProgressColor(
  elapsedTimePercentage: number
): ProgressProps["color"] {
  if (elapsedTimePercentage < 70) return "default";
  else if (elapsedTimePercentage < 90) return "warning";
  else return "error";
}

function getFlagProgress(traceFlag: TraceFlag) {
  const startDateTime = DateTime.fromISO(traceFlag.StartDate);
  const expirationDateTime = DateTime.fromISO(traceFlag.ExpirationDate);
  const nowDateTimeMs = DateTime.now().toMillis();
  const flagDurationMs =
    expirationDateTime.toMillis() - startDateTime.toMillis();

  const elapsedTimePercentage =
    ((nowDateTimeMs - startDateTime.toMillis()) / flagDurationMs) * 100;
  const isFuture = startDateTime.toMillis() > nowDateTimeMs;
  const isExpired = elapsedTimePercentage > 100;
  return {
    elapsedTimePercentage,
    expirationDateTime,
    isFuture,
    isExpired,
  };
}

const utils = {
  getProgressColor,
  getFlagProgress,
};

export default utils;
