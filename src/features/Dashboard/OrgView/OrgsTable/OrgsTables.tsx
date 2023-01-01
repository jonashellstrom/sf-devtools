import { Col, Loading, Row, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import mainApi from "../../../../mainApi";
import queryKeys from "../../../../shared/queryKeys";
import NonScratchesTable from "./NonScratchesTable";
import ScratchesTable from "./ScratchesTable";

function OrgsTables() {
  const { data, isLoading } = useQuery([queryKeys.LIST_ORGS], mainApi.listOrgs);

  if (!isLoading && !data) {
    return (
      <Text b>⛔️ Something went wrong fetching your authenticated orgs</Text>
    );
  }
  return (
    <>
      {isLoading ? (
        <Row justify="center">
          <Col
            css={{
              width: "auto",
            }}
          >
            <Text h5 b>
              Fetching your authenticated orgs
            </Text>
            <Loading
              color="secondary"
              type="points"
              size="lg"
              css={{ width: "100%" }}
            />
          </Col>
        </Row>
      ) : (
        <>
          <ScratchesTable orgs={data.result.scratchOrgs} />
          <NonScratchesTable orgs={data.result.nonScratchOrgs} />
        </>
      )}
    </>
  );
}

export default OrgsTables;
