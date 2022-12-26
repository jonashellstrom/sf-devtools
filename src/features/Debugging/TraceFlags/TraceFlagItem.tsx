import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Loading,
  Progress,
  Row,
  Text,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import CollapsingWrapper from "../DebugLogs/LogItem/CollapsingWrapper";
import { type TraceFlag } from "./types";
import utils from "./utils";

type TraceFlagItemProps = {
  traceFlag: TraceFlag;
};

function getRelativeExpirationTime(
  isFuture: boolean,
  isExpired: boolean,
  expirationDateTime: DateTime
) {
  if (isFuture) return "Starts " + expirationDateTime.toRelative();
  if (isExpired) return expirationDateTime.toRelative();
  return "Expires " + expirationDateTime.toRelative();
}

function TraceFlagItem({ traceFlag }: TraceFlagItemProps) {
  const queryClient = useQueryClient();

  const { elapsedTimePercentage, isFuture, isExpired, expirationDateTime } =
    utils.getFlagProgress(traceFlag);

  const [relativeExpirationTime, setRelativeExpirationTime] = useState<
    string | null
  >(getRelativeExpirationTime(isFuture, isExpired, expirationDateTime));

  const { mutate: deleteFlag, isLoading: isMutationLoading } = useMutation(
    () => mainApi.deleteRecord("TraceFlag", traceFlag.Id, true),
    {
      onSuccess() {
        queryClient
          .invalidateQueries({ queryKey: [queryKeys.TRACE_FLAGS] })
          .then(() => setIsCollapsibleOpen(true));
      },
    }
  );

  setInterval(() => {
    setRelativeExpirationTime(
      getRelativeExpirationTime(isFuture, isExpired, expirationDateTime)
    );
  }, 5000);

  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true);

  return (
    <CollapsingWrapper isOpen={isCollapsibleOpen} initialHeight={7}>
      <Card variant="bordered" css={{ mb: 15 }}>
        <Card.Body>
          <Row align="flex-start" justify="space-between">
            <Col css={{ mr: 10 }}>
              <Text size="$m" b>
                {`${traceFlag.Id}`}
              </Text>
              <Row>
                <Badge
                  size="xs"
                  color="primary"
                  css={{ mb: 5, mt: 2.5 }}
                  isSquared
                >{`${traceFlag.LogType}`}</Badge>
              </Row>
            </Col>
            <Col>
              <Row align="center">
                <Text size="$sm" css={{ mr: 5 }}>
                  {isFuture ? "Upcoming" : isExpired ? "Expired" : "Active"}
                </Text>
                {!isFuture && !isExpired && (
                  <Badge color="success" variant="points" />
                )}
              </Row>
              {!isExpired && !isFuture && (
                <Progress
                  size="xs"
                  value={elapsedTimePercentage}
                  color={utils.getProgressColor(elapsedTimePercentage)}
                />
              )}
              <Text size="$xs">{`${relativeExpirationTime}`}</Text>
            </Col>
            <Row align="center" justify="flex-end">
              <Button
                size="xs"
                color="error"
                flat
                disabled={isMutationLoading}
                onPress={() => {
                  deleteFlag();
                  setIsCollapsibleOpen(false);
                }}
                css={{
                  fontSize: "x-small",
                  fontWeight: "$bold",
                }}
              >
                {isMutationLoading ? (
                  <Loading color="currentColor" size="xs" />
                ) : (
                  "DELETE"
                )}
              </Button>
            </Row>
          </Row>
        </Card.Body>
      </Card>
    </CollapsingWrapper>
  );
}

export default TraceFlagItem;
