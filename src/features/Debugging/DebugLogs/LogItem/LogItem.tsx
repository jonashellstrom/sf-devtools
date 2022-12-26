import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Loading,
  Row,
  Text,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";

import Skeleton from "../../../../components/Skeleton";
import mainApi from "../../../../mainApi";
import queryKeys from "../../../../shared/queryKeys";
import { GetLogResponse } from "../../../../shared/sfdxResponses";
import utils from "../../../../shared/utils";
import CodeEditor from "../../../ApexEditor/CodeEditor";
import TextSkeleton from "../TextSkeleton";
import FullLogModal from "./FullLogModal";
import CollapsingWrapper from "./CollapsingWrapper";

type LogItemProps = {
  log: GetLogResponse | undefined;
  isLoading: boolean;
};

const EDITOR_HEIGHT = 110;

function LogItem({ log, isLoading }: LogItemProps) {
  const queryClient = useQueryClient();

  const logs = log?.result[0].log || "";
  const debugLinesOnly = utils.getOnlyDebugLogLines(logs);

  const [isShowingPrompt, setIsShowingPrompt] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true);

  const { mutate: deleteLog, isLoading: isMutationLoading } = useMutation(
    () => mainApi.deleteRecord("ApexLog", log?.logData.Id || "", true),
    {
      onSuccess() {
        queryClient
          .invalidateQueries({ queryKey: [queryKeys.LIST_LOGS] })
          .then(() => setIsCollapsibleOpen(true));
      },
    }
  );

  return (
    <>
      <FullLogModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        log={log && { ...log }}
      />
      <CollapsingWrapper isOpen={isCollapsibleOpen} initialHeight={14}>
        <Card
          variant="bordered"
          css={{ mb: 15 }}
          style={{
            opacity: 1,
            transition: "opacity 1000ms ease-in",
          }}
        >
          <Card.Body css={{ mt: -10, mb: -10 }}>
            <Row justify="space-between" align="center" css={{ height: 40 }}>
              {log ? (
                <Text size="$xs" b css={{ mb: 5 }}>
                  {`Log Group: ${log?.logData.Id}`}
                </Text>
              ) : (
                <TextSkeleton width={150} emoji={"Log Group: "} />
              )}
              <Button
                disabled={!log}
                auto
                flat
                size="xs"
                color="error"
                css={{
                  fontSize: "x-small",
                  fontWeight: "$bold",
                  minWidth: "60px",
                }}
                onPress={() => {
                  deleteLog();
                  setIsCollapsibleOpen(false);
                }}
              >
                {isMutationLoading ? (
                  <Loading size="xs" color="error" />
                ) : (
                  "DELETE"
                )}
              </Button>
            </Row>
            <Col css={{ mr: 10 }}>
              {isLoading ? (
                <Skeleton height={EDITOR_HEIGHT - 2} />
              ) : (
                <Container
                  css={{
                    pl: 0,
                    pr: 0,
                    position: "relative",
                    cursor: "pointer",
                    zIndex: 10000,
                    width: "auto",
                  }}
                  onMouseEnter={() => setIsShowingPrompt(true)}
                  onMouseLeave={() => setIsShowingPrompt(false)}
                >
                  <Container
                    css={{
                      position: "absolute",
                      bottom: 20,
                      right: 0,
                      zIndex: 100,
                      width: "auto",
                    }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    {isShowingPrompt && (
                      <Badge color="primary" css={{ fontSize: "x-small" }}>
                        CLICK TO SEE FULL LOG
                      </Badge>
                    )}
                  </Container>
                  <CodeEditor
                    language="apex"
                    code={debugLinesOnly}
                    placeholder={"No debug logs"}
                    isDisabled
                    minHeight={EDITOR_HEIGHT}
                  />
                </Container>
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
                        maxWidth: "180px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
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
                        "LLL d, yyyy 'at' h:mm:ss a"
                      )}`
                    : "Loading"}
                </Text>
              </Row>
            </Row>
          </Card.Body>
        </Card>
      </CollapsingWrapper>
    </>
  );
}

export default LogItem;
