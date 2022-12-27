import { Col, Loading, Row, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import mainApi from "../../../mainApi";

function MiniOrgInfo() {
  const { data, isLoading } = useQuery(["current-user"], mainApi.displayUser);

  return (
    <Row css={{ minWidth: "120px" }}>
      {isLoading ? (
        <Col>
          <Loading
            color="primary"
            textColor="primary"
            type="points"
            size="xs"
            css={{ mb: 7 }}
          />
          <Text size="x-small" css={{ mb: 5 }}>
            Getting default org...
          </Text>
        </Col>
      ) : (
        <Col>
          <Text
            size="x-small"
            css={{ fontWeight: "$bold" }}
          >{`${data?.result.alias}`}</Text>
          <Text size="x-small">{data?.result.orgId}</Text>
        </Col>
      )}
    </Row>
  );
}

export default MiniOrgInfo;
