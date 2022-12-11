import { Badge, Col, Row, Text } from "@nextui-org/react";

import { ListLogsResponse } from "../../../shared/sfdxResponses";

type DebugLogDetailsProps = {
  logList: ListLogsResponse;
  activePage: number;
};

function DebugLogDetails({ logList, activePage }: DebugLogDetailsProps) {
  return (
    <Row css={{ mb: 15 }}>
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
          <Col css={{ width: "270px" }}>
            <Row>
              <Text size="small" b css={{ width: "70px" }}>
                Operation
              </Text>
              <Row css={{ width: "200px" }} justify="flex-end">
                <Badge size="xs" css={{ ml: 5 }} color="warning">
                  {logList?.result[activePage - 1].Operation}
                </Badge>
              </Row>
            </Row>
            <Row>
              <Text size="small" b css={{ width: "70px" }}>
                Status
              </Text>
              <Row css={{ width: "200px" }} justify="flex-end">
                <Badge size="xs" css={{ ml: 5 }} color="primary">
                  {logList?.result[activePage - 1].Status}
                </Badge>
              </Row>
            </Row>
          </Col>
        </Row>
      )}
    </Row>
  );
}

export default DebugLogDetails;
