import { Col, Loading, Row, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import mainApi from "../../../mainApi";

function MiniOrgInfo() {
  const { data, isLoading } = useQuery(["current-user"], mainApi.displayUser);

  return (
    <Row css={{ mt: 5 }}>
      {isLoading ? (
        <Loading color="primary" textColor="primary" type="points" size="xs">
          <Text size="small" css={{ pt: 5 }}>
            Getting current org...
          </Text>
        </Loading>
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
