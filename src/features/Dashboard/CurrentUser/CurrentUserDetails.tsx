import { Col, Link, Loading, Row, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import mainApi from "../../../mainApi";

// TODO: type result
function CurrentUserDetails() {
  const { data, isLoading } = useQuery(["current-user"], mainApi.displayUser);

  function makeScratchNickname() {
    const parts = data?.result.instanceUrl.split("https://")[1].split("-");
    if (parts && parts.length > 2) {
      return `${parts[0].toLocaleUpperCase()} ${parts[1].toLocaleUpperCase()}`;
    } else {
      return "My Scratch";
    }
  }

  return (
    <Col css={{ mb: 20 }}>
      <Row align="center">
        <Text h5 b>
          Current SFDX Project Org
        </Text>
      </Row>
      <Row>
        {isLoading ? (
          <Loading color="primary" textColor="primary" type="points" size="xs">
            <Text size="small" css={{ pt: 5 }}>
              Getting default org...
            </Text>
          </Loading>
        ) : (
          <Col>
            <Text
              b
              size="medium"
            >{`Your current org is set as ${data?.result.alias}`}</Text>
            <Text size="small">{data?.result.username}</Text>
            <Text size="small">{data?.result.orgId}</Text>
            <Text size="small">
              <Link href={data?.result.instanceUrl}>
                {data?.result.instanceUrl}
              </Link>
            </Text>
            <Text size="small">{makeScratchNickname()}</Text>
          </Col>
        )}
      </Row>
    </Col>
  );
}

export default CurrentUserDetails;
