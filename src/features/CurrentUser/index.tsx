import { Col, Loading, Row, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import queries from "../../mainApi";

function CurrentUser() {
  const { data, isLoading } = useQuery(["current-user"], queries.displayUser);

  function makeScratchNickname() {
    const parts = data?.result.instanceUrl.split("https://")[1].split("-");
    if (parts && parts.length > 2) {
      return `${parts[0].toLocaleUpperCase()} ${parts[1].toLocaleUpperCase()}`;
    } else {
      return "My Scratch";
    }
  }

  return (
    <Row css={{ minWidth: "110px" }}>
      <Col css={{ overflow: "hidden" }}>
        {isLoading ? (
          <Loading color="primary" textColor="primary" type="points" size="xs">
            <Text size="xx-small">Getting current user...</Text>
          </Loading>
        ) : (
          <>
            <Text size="xx-small">Authenticated with Scratch</Text>
            <Text size="xx-small">{data?.result.orgId}</Text>
            <Text size="xx-small">{makeScratchNickname()}</Text>
          </>
        )}
      </Col>
    </Row>
  );
}

export default CurrentUser;
