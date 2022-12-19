import { Card, Col, Row, Text } from "@nextui-org/react";
import { DateTime } from "luxon";

import Skeleton from "../../../../components/Skeleton";
import { GetLogResponse } from "../../../../shared/sfdxResponses";
import utils from "../../../../shared/utils";
import CodeEditor from "../../../ApexEditor/CodeEditor";
import TextSkeleton from "../TextSkeleton";

type LogItemProps = {
  log: GetLogResponse | undefined;
  isLoading: boolean;
};

const EDITOR_HEIGHT = 110;

function LogItem({ log, isLoading }: LogItemProps) {
  const logs = log?.result[0].log || "";
  const debugLinesOnly = utils.getOnlyDebugLogLines(logs);

  return (
    <Card variant="bordered" css={{ mb: 15 }}>
      <Card.Body css={{ mt: -10, mb: -10 }}>
        {log ? (
          <Text size="$xs" b css={{ mb: 5 }}>
            {`Log Group: ${log?.logData.Id}`}
          </Text>
        ) : (
          <TextSkeleton width={150} emoji={"Log Group: "} />
        )}
        <Col css={{ mr: 10 }}>
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
        <Row>
          <Row>
            {log ? (
              <>
                <Text size="$xs" b>
                  {`💻 ${log.logData.Application}`}
                </Text>
                <Text size="$xs" b css={{ ml: 10 }}>
                  {`📤 ${log.logData.Request}`}
                </Text>
                <Text
                  size="$xs"
                  b
                  css={{
                    ml: 10,
                    maxWidth: "120px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {`🗂 ${log ? log.logData.Operation : "Loading"}`}
                </Text>
              </>
            ) : (
              <>
                <TextSkeleton width={50} emoji={"💻"} />
                <TextSkeleton width={50} emoji={"📤"} />
                <TextSkeleton width={50} emoji={"🗂"} />
              </>
            )}
          </Row>
          <Row justify="flex-end">
            <Text size="$xs" b css={{ ml: 10 }}>
              {log
                ? `⏱ ${DateTime.fromISO(log.logData.StartTime).toFormat(
                    "LLL d, yyyy 'at' h:mm:ssa"
                  )}`
                : "Loading"}
            </Text>
          </Row>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default LogItem;
