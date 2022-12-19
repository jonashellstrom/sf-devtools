import { Button, Collapse, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import soql, { type QueryTraceFlags } from "../../../shared/soql";
import AddTraceFlagModal from "./AddTraceFlagModal";
import TraceFlagItem from "./TraceFlagItem";
import { type TraceFlag } from "./types";

function TraceFlagList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery([queryKeys.TRACE_FLAGS], () =>
    mainApi.runSoql<QueryTraceFlags>(soql.QUERY_TRACE_FLAGS)
  );

  if (isError) {
    return (
      <Text b h4>
        ⛔️ Something went wrong fetching Trace Flags
      </Text>
    );
  }

  return (
    <>
      <AddTraceFlagModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <Collapse
        css={{ mt: -20, mb: 20, borderTop: "0px" }}
        title={
          <Text h5 b>
            Trace Flags
          </Text>
        }
        subtitle={
          <Text size="$xs" css={{ opacity: 0.7 }}>
            Expand to manage your trace flags
          </Text>
        }
      >
        {isLoading ? (
          <Skeleton
            count={1}
            height="97px"
            style={{
              borderRadius: 15,
              marginBottom: 15,
              marginTop: -10,
              border: "0.5px solid grey",
            }}
          />
        ) : (
          data?.result.records.map((f: TraceFlag) => (
            <TraceFlagItem traceFlag={f} key={f.Id} />
          ))
        )}
        <Button
          css={{ ml: 10, mb: 10 }}
          auto
          onPress={() => setIsModalOpen(true)}
          color="success"
          size="xs"
        >
          Create New Flag
        </Button>
      </Collapse>
    </>
  );
}

export default TraceFlagList;
