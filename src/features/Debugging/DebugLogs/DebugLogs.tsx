import { Button, Loading, Pagination, Row, Text } from "@nextui-org/react";
import { useState } from "react";
import { useQuery } from "react-query";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import utils from "../../../shared/utils";
import CodeEditor from "../../ApexEditor/CodeEditor";

function DebugLogs() {
  const [isTailing, setIsTailing] = useState(false);
  const [activeLogId, setActiveLogId] = useState("");
  const [activePage, setActivePage] = useState(1);

  const [logs, setLogs] = useState("");

  const { data: logList, isLoading: isListLogsLoading } = useQuery(
    queryKeys.LIST_LOGS,
    () => mainApi.listLogs(),
    { refetchInterval: isTailing ? 10_000 : 0 }
  );
  console.log("🍊 > DebugLogs > logList", logList);

  const { isLoading: isGetLogLoading } = useQuery(
    `${queryKeys.GET_LOG_BY_ID}-${activeLogId}`,
    () => mainApi.getLog(activeLogId),
    {
      enabled: Boolean(activeLogId),
      onSuccess(data) {
        console.log("🍊 > onSuccess > GET_LOG_BY_ID> data", data);
        const debugLinesOnly = utils.getOnlyDebugLogLines(data.result[0].log);
        setLogs(debugLinesOnly || "No debug lines...");
      },
    }
  );

  if (isListLogsLoading) {
    return <Loading />;
  }
  return (
    <>
      <Row justify="space-between">
        <Row align="center">
          <Text h4 b>
            Tailed Logs
          </Text>
          <Button
            size="xs"
            auto
            css={{ ml: 10, mb: 10 }}
            onPress={() => setIsTailing(!isTailing)}
            color={isTailing ? "warning" : "default"}
          >
            {isTailing ? "Pause Tailing" : "Start Tailing"}
          </Button>
        </Row>
        <Button size="xs" auto color="error">
          Delete All Logs
        </Button>
      </Row>
      <Text>{`Active Log: ${activeLogId}`}</Text>
      <CodeEditor
        language="apex"
        isDisabled
        code={logs}
        placeholder="Logs will show up here"
        isLoading={isGetLogLoading}
      />
      <Row justify="center">
        {isListLogsLoading ? (
          <Row>
            <Text>{`Fetching logs...`}</Text>
            <Loading css={{ ml: 10 }} type="points-opacity" />
          </Row>
        ) : (
          <Pagination
            bordered
            size="sm"
            siblings={3}
            total={logList?.result.length}
            initialPage={activePage}
            onChange={(page) => {
              if (logList) {
                setActivePage(page);
                setActiveLogId(logList?.result[page - 1].Id);
              }
            }}
          />
        )}
      </Row>
    </>
  );
}

export default DebugLogs;
