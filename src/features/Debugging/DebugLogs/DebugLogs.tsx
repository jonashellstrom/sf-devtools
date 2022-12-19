import { Col, Pagination, Progress, Row, Text } from "@nextui-org/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import { type ListLogsResponse } from "../../../shared/sfdxResponses";
import DebugLogsActionRow from "./DebugLogsActionRow";
import LogItem from "./LogItem/LogItem";

const LOGS_PER_PAGE = 5;

function DebugLogs() {
  const [isFetching, setIsFetching] = useState(false);
  const [logPageStart, setLogPageStart] = useState(0);
  const [fetchedLogs, setFetchedLogs] = useState<
    ListLogsResponse["result"] | []
  >([]);

  function handlePaginationChange(page: number) {
    setLogPageStart(page * LOGS_PER_PAGE);
  }

  const { data: logList, isLoading: isLogListLoading } = useQuery(
    [queryKeys.LIST_LOGS],
    () => mainApi.listLogs(),
    {
      onSuccess: (data) => {
        setFetchedLogs(data.result);
        if (!logPageStart) setLogPageStart(LOGS_PER_PAGE);
      },
      refetchInterval: isFetching ? 10_000 : 0,
      staleTime: Infinity,
      refetchOnMount: "always",
    }
  );

  const logsQueries = useQueries({
    queries:
      fetchedLogs &&
      fetchedLogs
        .slice(logPageStart - LOGS_PER_PAGE, logPageStart)
        .map((log) => {
          return {
            queryKey: ["log-id", log.Id],
            queryFn: () => mainApi.getLog(log.Id, log),
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
        isFetching={isFetching}
        setIsFetching={setIsFetching}
        hasFetchedLogs={fetchedLogs.length > 0}
        logGroupCount={logList ? logList.result.length : 0}
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
          css={{ mb: 15 }}
        />
      </Col>
      {logsQueries.map((logQuery, i) => {
        return (
          <LogItem
            key={`log-item-${i}`}
            log={logQuery.data}
            isLoading={logQuery.isLoading}
          />
        );
      })}
      {!isLogListLoading && logList && fetchedLogs.length > 0 && (
        <Row justify="center" align="center" css={{ mb: 15, width: "auto" }}>
          <Col css={{ width: "auto" }}>
            <Pagination
              bordered
              size="sm"
              initialPage={1}
              total={Math.ceil(logList.result.length / LOGS_PER_PAGE)}
              onChange={handlePaginationChange}
              siblings={3}
              css={{ mb: 10 }}
            />
            <Row justify="center">
              <Text size="$xs">
                {fetchedLogs.length > 1
                  ? `Viewing logs ${logPageStart - LOGS_PER_PAGE + 1} to ${
                      logPageStart > logList.result.length
                        ? logList.result.length
                        : logPageStart
                    } out of ${logList.result.length} total`
                  : "Fetching logs"}
              </Text>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
}

export default DebugLogs;
