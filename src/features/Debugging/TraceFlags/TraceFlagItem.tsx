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
import { useState } from "react";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";

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
        queryClient.invalidateQueries({ queryKey: [queryKeys.TRACE_FLAGS] });
      },
    }
  );

  setInterval(() => {
    setRelativeExpirationTime(
      getRelativeExpirationTime(isFuture, isExpired, expirationDateTime)
    );
  }, 5000);

  return (
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
          {/* <Col>
            <Text size="$sm">Traced Entity</Text>
            <pre
              style={{ fontSize: "10px" }}
            >{`${traceFlag.TracedEntity.Name}`}</pre>
            <pre
              style={{ fontSize: "10px" }}
            >{`${traceFlag.TracedEntityId}`}</pre>
          </Col>
          <Col css={{ ml: 10 }}>
            <Text size="$sm">Debug Levels</Text>
            <pre
              style={{ fontSize: "7.5px" }}
            >{`ApexCode: ${traceFlag.ApexCode}`}</pre>
            <pre
              style={{ fontSize: "7.5px" }}
            >{`ApexProfiling: ${traceFlag.ApexProfiling}`}</pre>
            <pre
              style={{ fontSize: "7.5px" }}
            >{`Callout: ${traceFlag.Callout}`}</pre>
          </Col>
          <Col>
            <pre
              style={{ fontSize: "7.5px", marginTop: "23px" }}
            >{`System: ${traceFlag.System}`}</pre>
            <pre
              style={{ fontSize: "7.5px" }}
            >{`Validation: ${traceFlag.Validation}`}</pre>
            <pre
              style={{ fontSize: "7.5px" }}
            >{`Visualforce: ${traceFlag.Visualforce}`}</pre>
          </Col> */}
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
          <Row justify="flex-end">
            <Col css={{ width: "auto" }}>
              <Button size="xs" color="primary" flat css={{ mb: 10 }}>
                Update
              </Button>
              <Button
                size="xs"
                color="error"
                flat
                disabled={isMutationLoading}
                onPress={() => deleteFlag()}
              >
                {isMutationLoading ? (
                  <Loading color="currentColor" size="xs" />
                ) : (
                  "Delete"
                )}
              </Button>
            </Col>
          </Row>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default TraceFlagItem;
