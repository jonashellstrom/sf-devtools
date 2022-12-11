import { Card, Col, Row, Text } from "@nextui-org/react";
import { DateTime } from "luxon";
import Skeleton from "../../../components/Skeleton";

import {
  GetLogResponse,
  ListLogsResponse,
} from "../../../shared/sfdxResponses";
import utils from "../../../shared/utils";
import CodeEditor from "../../ApexEditor/CodeEditor";

type LogItemProps = {
  log: GetLogResponse | undefined;
  logData: ListLogsResponse["result"][number];
  isLoading: boolean;
};

const EDITOR_HEIGHT = 100;

function LogItem({ log, logData, isLoading }: LogItemProps) {
  const logs = log?.result[0].log || "";
  const debugLinesOnly = utils.getOnlyDebugLogLines(logs);

  return (
    <Card variant="bordered" css={{ mb: 15 }}>
      <Card.Body>
        <Row align="flex-start" justify="space-between">
          <Col css={{ mr: 10 }}>
            <Row css={{ mb: 10 }}>
              <Text size="$xs" b>
                {`📑 ${logData.Id}`}
              </Text>
              <Text size="$xs" b css={{ ml: 10 }}>
                {`💻 ${logData.Application}`}
              </Text>
              <Text size="$xs" b css={{ ml: 10 }}>
                {`⏱ ${DateTime.fromISO(logData.StartTime).toFormat(
                  "LLL d, yyyy 'at' h:mm:ssa"
                )}`}
              </Text>
            </Row>
            {isLoading ? (
              <Skeleton height={EDITOR_HEIGHT - 2} />
            ) : (
              <CodeEditor
                language="apex"
                code={debugLinesOnly}
                placeholder={"No debug logs"}
                isDisabled
                minHeight={EDITOR_HEIGHT}
              />
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default LogItem;
