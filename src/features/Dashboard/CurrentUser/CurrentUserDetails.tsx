import { Card, Col, Loading, Row, Text } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import Limits from "../Limits/Limits";

function CurrentUserDetails() {
  const { data, isLoading } = useQuery(
    [queryKeys.CURRENT_USER],
    mainApi.displayUser
  );
  const { mutate: openOrg, isLoading: isOpenOrgLoading } = useMutation(
    (username: string) => mainApi.openOrg(username)
  );

  return (
    <Card variant="bordered" css={{ mb: 15 }}>
      <Card.Body>
        <Row align="center">
          <Text h5 b>
            Current Org
          </Text>
        </Row>
        <Row>
          {isLoading ? (
            <Loading color="secondary" type="points" size="xs">
              <Text size="$sm" css={{ pt: 5 }}>
                Getting default org...
              </Text>
            </Loading>
          ) : (
            <Col>
              <Text
                b
                size="$sm"
              >{`Your default sfdx org is set as ${data?.result.alias} (${data?.result.orgId})`}</Text>
              <Text size="$sm">{data?.result.username}</Text>
              <Row>
                <Text
                  size="$sm"
                  onClick={() => data && openOrg(data.result.username)}
                  css={{
                    cursor: "pointer",
                    color: "#68ABF8",
                    "&:hover": {
                      color: "#4187D8",
                    },
                  }}
                >
                  {isOpenOrgLoading
                    ? "Opening org in browser..."
                    : data?.result.instanceUrl}
                </Text>
              </Row>
            </Col>
          )}
        </Row>
        <Limits />
      </Card.Body>
    </Card>
  );
}

export default CurrentUserDetails;
