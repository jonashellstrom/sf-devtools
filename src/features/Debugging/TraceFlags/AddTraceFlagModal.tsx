import { useState } from "react";
import {
  Button,
  Input,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import { DateTime } from "luxon";

import mainApi from "../../../mainApi";
import soql, { type QueryTraceFlags } from "../../../shared/soql";
import queryKeys from "../../../shared/queryKeys";
import { type NewTraceFlag } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SfdxErrorResponse } from "../../../shared/sfdxResponses";
import useCreateDebugLevel from "./useCreateDebugLevel";

type AddTraceFlagModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
};

const LOG_TYPE = "USER_DEBUG";

function buildCreateTraceFlagRequest(
  newTraceFlag: NewTraceFlag,
  debugLevelId: string,
  tracedEntityId: string
) {
  return (
    `LogType=${LOG_TYPE} ` +
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
    isLoading: isDebugLevelCheckLoading,
    debugLevelId,
    debugLevelName,
  } = useCreateDebugLevel();

  const {
    data: tracedEntities,
    isLoading,
    isError,
  } = useQuery([queryKeys.TRACED_ENTITIES], () =>
    mainApi.runSoql<QueryTraceFlags>(soql.QUERY_TRACE_FLAGS)
  );

  const firstResult = tracedEntities?.result.records[0] ?? null;

  const [durationInMinutes, setDurationInMinutes] = useState(60);
  const [newTraceFlag, setNewTraceFlag] = useState<NewTraceFlag>({
    startTime: DateTime.now().plus({ minute: 1 }),
    endTime: DateTime.now().plus({ hour: 1, minute: 1 }),
    debugLevelId: debugLevelId ?? "",
    tracedEntityId: (firstResult && firstResult)?.TracedEntityId ?? "",
  });

  const {
    mutate: createRecord,
    isLoading: isMutationLoading,
    isError: isMutationError,
    error,
  } = useMutation(
    (values: string) => mainApi.createRecord("TraceFlag", values, true),
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [queryKeys.TRACE_FLAGS] });
        setIsModalOpen(false);
      },
    }
  );

  if (isDebugLevelCheckLoading || debugLevelId === null) {
    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blur
        css={{ height: 70 }}
      >
        <Loading />
      </Modal>
    );
  }

  function handleRangeChange(rangeValue: string) {
    const rangeInMinutes = Math.round(Number(rangeValue) * (60 / 100));
    setDurationInMinutes(rangeInMinutes);

    setNewTraceFlag({
      ...newTraceFlag,
      endTime: newTraceFlag.startTime.plus({
        minute: rangeInMinutes,
      }),
    });
  }

  function handleOnTracedEntitySelect(entityId: string) {
    console.log("hiii: ", entityId);
  }

  function handleAddNewPress() {
    if (newTraceFlag.endTime && newTraceFlag.startTime && tracedEntities) {
      createRecord(
        buildCreateTraceFlagRequest(
          newTraceFlag,
          debugLevelId ?? "",
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
      blur
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
              New Trace Flag
            </Text>
          </Modal.Header>
          <Modal.Body css={{ p: 30 }}>
            <Input
              bordered
              labelPlaceholder="Debug Level"
              color="secondary"
              value={debugLevelName}
              disabled
            />
            <Spacer y={0.5} />
            <Input
              bordered
              clearable
              labelPlaceholder="Traced Entity Id"
              color="secondary"
              value={tracedEntities?.result.records[0].TracedEntityId}
              type="submit"
            >
              <select
                onChange={(e) => handleOnTracedEntitySelect(e.target.value)}
              >
                {tracedEntities.result.records.map((r, idx) => (
                  <option value={r.TracedEntityId} key={`traced-entity-${idx}`}>
                    {r.TracedEntity.Name}
                  </option>
                ))}
              </select>
            </Input>
            <Input
              label="Start Date"
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
              label="Start Time"
              type="time"
              value={newTraceFlag.startTime.toFormat("HH:mm")}
              onChange={(e) =>
                setNewTraceFlag({
                  ...newTraceFlag,
                  startTime: newTraceFlag.startTime.set({
                    hour: DateTime.fromFormat(e.target.value, "HH:mm").hour,
                    minute: DateTime.fromFormat(e.target.value, "HH:mm").minute,
                  }),
                })
              }
            />
            <Input
              label="Duration"
              type="range"
              onChange={(e) => handleRangeChange(e.target.value)}
              value={durationInMinutes / (60 / 100)}
              helperText={`Logs will remain active for ${durationInMinutes} minutes`}
            />
          </Modal.Body>
          <Modal.Footer>
            <Row justify="space-between">
              <Text size="$xs" color="error">
                {isMutationError && `${(error as SfdxErrorResponse).message}`}
              </Text>
              <Button
                auto
                onPress={handleAddNewPress}
                color="primary"
                css={{ ml: 10 }}
              >
                {isMutationLoading ? (
                  <Loading color="currentColor" size="sm" />
                ) : (
                  "Create"
                )}
              </Button>
            </Row>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

export default AddTraceFlagModal;
