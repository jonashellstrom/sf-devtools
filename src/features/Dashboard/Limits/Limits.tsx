import { Row, Text, Collapse, Loading } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import LimitItem from "./LimitItem";

function Limits() {
  const { data, isLoading } = useQuery(
    [queryKeys.LIST_LIMITS],
    mainApi.listLimits
  );

  return (
    <>
      <Row>
        <Collapse
          css={{
            mb: -20,
            borderTop: "0px",
            borderBottom: "0px",
            width: "100%",
          }}
          title={
            <Text h5 b>
              Limits for Org
            </Text>
          }
          subtitle={
            <Text size="$xs" css={{ opacity: 0.7 }}>
              Expand to see your org's limits
            </Text>
          }
        >
          {isLoading ? (
            <Loading
              color="primary"
              textColor="primary"
              type="points"
              css={{ width: "100%" }}
              size="md"
            >
              <Text css={{ pt: 15 }}>Getting org limits...</Text>
            </Loading>
          ) : (
            data?.result.map((l, idx) => (
              <LimitItem
                key={`limit-item-${idx}`}
                name={l.name}
                max={l.max}
                remaining={l.remaining}
              />
            ))
          )}
        </Collapse>
      </Row>
    </>
  );
}

export default Limits;
