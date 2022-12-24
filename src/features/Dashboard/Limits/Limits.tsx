import { Row, Text, Collapse, Loading } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import mainApi from "../../../mainApi";
import LimitItem from "./LimitItem";

function Limits() {
  // TODO: handle errors
  const { data, isLoading } = useQuery(["list-limits"], mainApi.listLimits);

  return (
    <>
      <Row>
        <Collapse
          css={{ mt: -20, mb: 20, borderTop: "0px", width: "100%" }}
          title={
            <Text h5 b>
              Limits for Org
            </Text>
          }
          subtitle={
            <Text size="$xs" css={{ opacity: 0.7 }}>
              Expand to see your Org's Limits
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
