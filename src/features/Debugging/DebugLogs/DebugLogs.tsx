import { Button, Col, Progress, Text } from "@nextui-org/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import { type ListLogsResponse } from "../../../shared/sfdxResponses";
import DebugLogsActionRow from "./DebugLogsActionRow";
import LogItem from "./LogItem";

function DebugLogs() {
  const [isTailing, setIsTailing] = useState(false);
  const [fetchedLogs, setFetchedLogs] = useState<
    ListLogsResponse["result"] | []
  >([]);

  const [partialLogsSet, setPartialLogsSet] = useState(0);

  const { data: _data } = useQuery(
    [queryKeys.LIST_LOGS],
    () => mainApi.listLogs(),
    {
      onSuccess: (data) => {
        setFetchedLogs(data.result);
        setPartialLogsSet((v) => v + 3);
      },
      refetchInterval: isTailing ? 10_000 : 0,
    }
  );

  const logsQueries = useQueries({
    queries:
      fetchedLogs &&
      fetchedLogs.slice(0, partialLogsSet).map((log) => {
        return {
          queryKey: ["log-id", log.Id],
          queryFn: () => mainApi.getLog(log.Id),
          enabled: fetchedLogs && fetchedLogs.length > 0,
          staleTime: Infinity,
        };
      }),
  });

  const isDoneFetching = logsQueries.every((i) => i.isFetched);

  const finishedCount = logsQueries.reduce(
    (sum, q) => sum + (q.isFetched ? 1 : 0),
    0
  );

  return (
    <>
      <DebugLogsActionRow
        isTailing={isTailing}
        setIsTailing={setIsTailing}
        hasFetchedLogs={fetchedLogs.length > 0}
      />
      <Col>
        <Text size="$xs" css={{ mb: 5 }}>
          {isDoneFetching
            ? `Fetched ${logsQueries.length} log groups`
            : `Fetched ${finishedCount} out of ${logsQueries.length} log groups`}
        </Text>
        <Progress
          size="xs"
          value={(finishedCount / logsQueries.length) * 100}
          color={isDoneFetching ? "success" : "warning"}
          striped={!isDoneFetching}
          animated
          css={{ mb: 10 }}
        />
      </Col>
      {logsQueries.map((logQuery, i) => (
        <LogItem
          key={`log-item-${i}`}
          log={logQuery.data}
          logData={fetchedLogs[i]}
          isLoading={logQuery.isLoading}
        />
      ))}
      <Button
        onPress={() => setPartialLogsSet((v) => v + 3)}
        disabled={!isDoneFetching}
      >
        Fetch more
      </Button>
      {/* <Row justify="center">
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
                    setLogs(
                      `Fetching Apex Logs with ID ${
                        logList?.result[page - 1].Id
                      }`
                    );
                    setActiveLogId(logList?.result[page - 1].Id);
                  }
                }}
              />
              <Text b>Log Groups</Text>
            </>
          )
        )}
      </Row> */}
    </>
  );
}

export default DebugLogs;
