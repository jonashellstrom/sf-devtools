import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "react-query";

import mainApi from "../../../mainApi";
import soql, {
  QueryDebugLevels,
  type QueryTraceFlags,
} from "../../../shared/soql";
import queryKeys from "../../../shared/queryKeys";
import type { NewTraceFlag } from "./types";

type AddTraceFlagModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
};

function buildCreateTraceFlagRequest(
  newTraceFlag: NewTraceFlag,
  debugLevelId: string,
  tracedEntityId: string
) {
  return (
    "LogType=DEVELOPER_LOG " +
    `StartDate=${newTraceFlag.startTime.toISO()} ` +
    `ExpirationDate=${newTraceFlag.endTime.toISO()} ` +
    `DebugLevelId=${debugLevelId} ` +
    `TracedEntityId=${tracedEntityId} `
  );
}

function AddTraceFlagModal({
  isModalOpen,
  setIsModalOpen,
}: AddTraceFlagModalProps) {
  const queryClient = useQueryClient();
  const {
    data: tracedEntities,
    isLoading,
    isError,
  } = useQuery(queryKeys.TRACED_ENTITIES, () =>
    mainApi.runSoql<QueryTraceFlags>(soql.QUERY_TRACE_FLAGS)
  );
  const { data: debugLevels } = useQuery(queryKeys.DEBUG_LEVELS, () =>
    mainApi.runSoql<QueryDebugLevels>(soql.QUERY_DEBUG_LEVELS)
  );

  const [newTraceFlag, setNewTraceFlag] = useState<NewTraceFlag>({
    startTime: DateTime.now().plus({ minute: 1 }),
    endTime: DateTime.now().plus({ hour: 1, minute: 1 }),
    debugLevelId: debugLevels?.result.records[0].Id ?? "",
    tracedEntityId: tracedEntities?.result.records[0].TracedEntityId ?? "",
  });

  const { mutate: createRecord, isLoading: isMutationLoading } = useMutation(
    (values: string) => mainApi.createRecord("TraceFlag", values, true),
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [queryKeys.TRACE_FLAGS] });
        setIsModalOpen(false);
      },
    }
  );

  async function handleAddNewPress() {
    if (
      newTraceFlag.endTime &&
      newTraceFlag.startTime &&
      debugLevels &&
      tracedEntities
    ) {
      createRecord(
        buildCreateTraceFlagRequest(
          newTraceFlag,
          debugLevels.result.records[0].Id,
          tracedEntities.result.records[0].TracedEntityId
        )
      );
    }
  }

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      {isError ? (
        <Text b h4>
          ⛔️ Something went wrong...
        </Text>
      ) : isLoading ? (
        <Loading />
      ) : (
        <>
          <Modal.Header>
            <Text id="modal-title" size={18} b>
              Add New Trace Flag
            </Text>
          </Modal.Header>
          <Modal.Body css={{ p: 30 }}>
            <Input
              bordered
              clearable
              labelPlaceholder="Debug Level"
              color="secondary"
              value={debugLevels?.result.records[0].DeveloperName}
            />
            <Spacer y={0.5} />
            <Input
              bordered
              clearable
              labelPlaceholder="Traced Entity Id"
              color="secondary"
              value={tracedEntities?.result.records[0].TracedEntityId}
            />
            <Row>
              <Card variant="bordered" css={{ padding: 15, mr: 10 }}>
                <Text b>Starts at</Text>
                <Input
                  width="150px"
                  label="Date"
                  type="date"
                  min={DateTime.now().toSQLDate()}
                  value={newTraceFlag.startTime.toSQLDate()}
                  onChange={(e) =>
                    setNewTraceFlag({
                      ...newTraceFlag,
                      startTime: newTraceFlag.startTime.set({
                        year: DateTime.fromSQL(e.target.value).year,
                        month: DateTime.fromSQL(e.target.value).month,
                        day: DateTime.fromSQL(e.target.value).day,
                      }),
                    })
                  }
                />
                <Input
                  width="150px"
                  label="Time"
                  type="time"
                  value={newTraceFlag.startTime.toFormat("HH:mm")}
                  onChange={(e) =>
                    setNewTraceFlag({
                      ...newTraceFlag,
                      startTime: newTraceFlag.startTime.set({
                        hour: DateTime.fromFormat(e.target.value, "HH:mm").hour,
                        minute: DateTime.fromFormat(e.target.value, "HH:mm")
                          .minute,
                      }),
                    })
                  }
                />
              </Card>
              <Card variant="bordered" css={{ padding: 15 }}>
                <Text b>Ends at</Text>
                <Input
                  width="150px"
                  label="Date"
                  type="date"
                  min={DateTime.now().toSQLDate()}
                  value={newTraceFlag.endTime.toSQLDate()}
                  onChange={(e) =>
                    setNewTraceFlag({
                      ...newTraceFlag,
                      endTime: newTraceFlag.endTime.set({
                        year: DateTime.fromSQL(e.target.value).year,
                        month: DateTime.fromSQL(e.target.value).month,
                        day: DateTime.fromSQL(e.target.value).day,
                      }),
                    })
                  }
                  css={{ mr: 15 }}
                />
                <Input
                  width="150px"
                  label="Time"
                  type="time"
                  value={newTraceFlag.endTime.toFormat("HH:mm")}
                  onChange={(e) =>
                    setNewTraceFlag({
                      ...newTraceFlag,
                      endTime: newTraceFlag.endTime.set({
                        hour: DateTime.fromFormat(e.target.value, "HH:mm").hour,
                        minute: DateTime.fromFormat(e.target.value, "HH:mm")
                          .minute,
                      }),
                    })
                  }
                />
              </Card>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button auto onPress={handleAddNewPress} color="primary">
              {isMutationLoading ? (
                <Loading color="currentColor" size="sm" />
              ) : (
                "Create"
              )}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

export default AddTraceFlagModal;
