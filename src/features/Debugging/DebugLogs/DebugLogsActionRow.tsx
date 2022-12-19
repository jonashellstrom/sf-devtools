import { Row, Text } from "@nextui-org/react";

import BulkDeleteButton from "./BulkDeleteButton";
import FetchingButton from "./FetchingButton";

type DebugLogsActionRowProps = {
  isFetching: boolean;
  setIsFetching: (v: boolean) => void;
  hasFetchedLogs: boolean;
  logGroupCount: number;
};
function DebugLogsActionRow({
  isFetching,
  setIsFetching,
  hasFetchedLogs,
  logGroupCount,
}: DebugLogsActionRowProps) {
  return (
    <>
      <Row justify="space-between">
        <Row align="center">
          <Text h5 b>
            Log Groups
          </Text>
          <FetchingButton
            isFetching={isFetching}
            setIsFetching={setIsFetching}
          />
        </Row>
        <BulkDeleteButton isDisabled={!hasFetchedLogs} />
      </Row>
      <Row justify="space-between">
        <Text size="$xs" css={{ mb: 5, opacity: 0.7 }} b>
          {`${logGroupCount} total log groups fetched`}
        </Text>
      </Row>
    </>
  );
}

export default DebugLogsActionRow;
