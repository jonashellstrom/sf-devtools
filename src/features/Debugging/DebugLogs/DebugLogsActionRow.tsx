import { Row, Text } from "@nextui-org/react";

import BulkDeleteButton from "./BulkDeleteButton";
import TailingButton from "./TailingButton";

type DebugLogsActionRowProps = {
  isTailing: boolean;
  setIsTailing: (v: boolean) => void;
  hasFetchedLogs: boolean;
};
function DebugLogsActionRow({
  isTailing,
  setIsTailing,
  hasFetchedLogs,
}: DebugLogsActionRowProps) {
  return (
    <Row justify="space-between">
      <Row align="center">
        <Text h5 b>
          Tailed Logs
        </Text>
        <TailingButton isTailing={isTailing} setIsTailing={setIsTailing} />
      </Row>
      <BulkDeleteButton isDisabled={!hasFetchedLogs} />
    </Row>
  );
}

export default DebugLogsActionRow;
