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
import { useMutation, useQueryClient } from "react-query";
import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";

import { type TraceFlag } from "./types";
import utils from "./utils";

type TraceFlagItemProps = {
  traceFlag: TraceFlag;
};

function TraceFlagItem({ traceFlag }: TraceFlagItemProps) {
  const queryClient = useQueryClient();

  const { elapsedTimePercentage, relativeExpirationTime, isFuture, isExpired } =
    utils.getFlagProgress(traceFlag);

  const { mutate: deleteFlag, isLoading: isMutationLoading } = useMutation(
    () => mainApi.deleteRecord("TraceFlag", traceFlag.Id, true),
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [queryKeys.TRACE_FLAGS] });
      },
    }
  );

  function makeExpirationTimeStatus() {
    if (isFuture) return "Starts " + relativeExpirationTime;
    if (isExpired) return "" + relativeExpirationTime;
    return "Expires " + relativeExpirationTime;
  }

  return (
    <Card variant="bordered" css={{ mb: 15 }}>
      <Card.Body>
        <Row align="flex-start" justify="space-between">
          <Col>
            <Text size="$m" b>
              Trace Flag
            </Text>
            <pre style={{ fontSize: "10px" }}>{`${traceFlag.Id}`}</pre>
            <Badge
              size="xs"
              color="default"
              css={{ mb: 5, mt: 2.5 }}
            >{`${traceFlag.LogType}`}</Badge>
          </Col>
          <Col>
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
            <pre
              style={{ fontSize: "7.5px" }}
            >{`Database: ${traceFlag.Database}`}</pre>
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
            <pre
              style={{ fontSize: "7.5px" }}
            >{`Workflow: ${traceFlag.Workflow}`}</pre>
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
            <Text size="$xs">{`${makeExpirationTimeStatus()}`}</Text>
          </Col>
          <Row justify="flex-end">
            <Col css={{ width: "auto" }}>
              <Button size="xs" css={{ mb: 5 }}>
                Update
              </Button>
              <Button size="xs" color="error" onPress={() => deleteFlag()}>
                {isMutationLoading ? (
                  <Loading color="currentColor" size="sm" />
                ) : (
                  "Remove"
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
