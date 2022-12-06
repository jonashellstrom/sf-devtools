import {
  Badge,
  Button,
  Col,
  Loading,
  Pagination,
  Row,
  Text,
} from "@nextui-org/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import utils from "../../../shared/utils";
import CodeEditor from "../../ApexEditor/CodeEditor";

function DebugLogs() {
  const queryClient = useQueryClient();

  const [isTailing, setIsTailing] = useState(false);
  const [activeLogId, setActiveLogId] = useState("");
  const [activePage, setActivePage] = useState(1);

  const [logs, setLogs] = useState("");

  const { data: logList, isLoading: isListLogsLoading } = useQuery(
    queryKeys.LIST_LOGS,
    () => mainApi.listLogs(),
    { refetchInterval: isTailing ? 10_000 : 0 }
  );

  const { isLoading: isGetLogLoading } = useQuery(
    `${queryKeys.GET_LOG_BY_ID}-${activeLogId}`,
    () => mainApi.getLog(activeLogId),
    {
      enabled: Boolean(activeLogId),
      onSuccess(data) {
        const debugLinesOnly = utils.getOnlyDebugLogLines(data.result[0].log);
        setLogs(debugLinesOnly || "No debug lines...");
      },
    }
  );

  const { mutate: bulkDeleteLogs, isLoading: isBulkDeleteLogsLoading } =
    useMutation(() => mainApi.bulkDeleteLogs(), {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [queryKeys.LIST_LOGS] });
      },
    });

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
        <Button size="xs" auto color="error" onPress={() => bulkDeleteLogs()}>
          {isBulkDeleteLogsLoading ? (
            <Loading color="currentColor" size="xs" />
          ) : (
            "Delete All Logs"
          )}
        </Button>
      </Row>
      <Row>
        {logList && logList.result.length > 1 && (
          <Row justify="space-between">
            <Row>
              <Text size="small" b>
                Log Id
              </Text>
              <Badge size="xs" css={{ ml: 5 }}>
                {logList?.result[activePage - 1].Id}
              </Badge>
            </Row>
            <Col css={{ width: "200px" }}>
              <Row>
                <Text size="small" b css={{ width: "100px" }}>
                  Operation
                </Text>
                <Row css={{ width: "130px" }} justify="flex-end">
                  <Badge size="xs" css={{ ml: 5 }} color="warning">
                    {logList?.result[activePage - 1].Operation}
                  </Badge>
                </Row>
              </Row>
              <Row>
                <Text size="small" b css={{ width: "100px" }}>
                  Status
                </Text>
                <Row css={{ width: "130px" }} justify="flex-end">
                  <Badge size="xs" css={{ ml: 5 }} color="primary">
                    {logList?.result[activePage - 1].Status}
                  </Badge>
                </Row>
              </Row>
            </Col>
          </Row>
        )}
      </Row>
      <CodeEditor
        language="apex"
        isDisabled
        code={logs}
        placeholder="Debug logs will show up here"
        isLoading={isGetLogLoading}
      />
      <Row justify="center">
        {isListLogsLoading ? (
          <Row>
            <Text>{`Fetching logs...`}</Text>
            <Loading css={{ ml: 10 }} type="points-opacity" />
          </Row>
        ) : (
          logList &&
          logList.result.length > 0 && (
            <>
              <Pagination
                bordered
                size="sm"
                siblings={3}
                total={logList?.result.length}
                initialPage={activePage}
                onChange={(page) => {
                  if (logList) {
                    setActivePage(page);
                    setLogs("LOADING...");
                    setActiveLogId(logList?.result[page - 1].Id);
                  }
                }}
              />
              <Text b>Log Groups</Text>
            </>
          )
        )}
      </Row>
    </>
  );
}

export default DebugLogs;
