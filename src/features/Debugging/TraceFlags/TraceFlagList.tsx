import { Button, Loading, Row, Text } from "@nextui-org/react";
import { useState } from "react";
import { useQuery } from "react-query";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";
import soql, { type QueryTraceFlags } from "../../../shared/soql";
import AddTraceFlagModal from "./AddTraceFlagModal";
import TraceFlagItem from "./TraceFlagItem";
import { type TraceFlag } from "./types";

function TraceFlagList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery(queryKeys.TRACE_FLAGS, () =>
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
      <Row align="center">
        <Text h4 b>
          Trace Flags
        </Text>
        <Button
          size="xs"
          css={{ ml: 10, mb: 10 }}
          color="success"
          onPress={() => setIsModalOpen(true)}
          flat
        >
          + Create New
        </Button>
      </Row>
      {isLoading ? (
        <Row align="center" justify="center" css={{ m: 20 }}>
          <Text>Fetching Trace Flags</Text>
          <Loading size="md" css={{ ml: 10 }} />
        </Row>
      ) : (
        data?.result.records.map((f: TraceFlag) => (
          <TraceFlagItem traceFlag={f} key={f.Id} />
        ))
      )}
    </>
  );
}

export default TraceFlagList;
