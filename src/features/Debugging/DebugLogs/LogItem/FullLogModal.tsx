import { Modal, Row, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import mainApi from "../../../../mainApi";
import queryKeys from "../../../../shared/queryKeys";

import { type GetLogResponse } from "../../../../shared/sfdxResponses";

type FullLogModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  logId: string;
  logData: GetLogResponse["logData"];
};

function FullLogModal({
  isModalOpen,
  setIsModalOpen,
  logId,
  logData,
}: FullLogModalProps) {
  const { data } = useQuery([queryKeys.GET_LOG, logId], () =>
    mainApi.getLog(logId, logData)
  );

  const logs = data?.result[0].log || "";

  const debugLinesOnly = logs;

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      width="90%"
      blur
      css={{ mt: 70 }}
    >
      <Modal.Header>
        <Row justify="space-between" align="center">
          <Text
            id="modal-title"
            size="$md"
            b
            css={{ width: "100%", textAlign: "start" }}
          >
            {`Log Group: ${logData.Id}`}
          </Text>
          <Row justify="flex-end">
            <Text size="$xs" b css={{ ml: 10 }}>
              {`Size: ${new Blob([debugLinesOnly]).size} bytes`}
            </Text>
            <Text size="$xs" b css={{ ml: 10 }}>
              {DateTime.fromISO(logData.StartTime).toFormat(
                "LLL d, yyyy 'at' h:mm:ss a"
              )}
            </Text>
          </Row>
        </Row>
      </Modal.Header>
      <Modal.Body css={{ pt: 10 }}>
        <textarea
          value={debugLinesOnly}
          disabled
          style={{ minHeight: 530, fontSize: "12px" }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Row justify="flex-start">
          <Text size="$xs" b>
            {`Application: ${logData.Application}`}
          </Text>
          <Text size="$xs" b css={{ ml: 10 }}>
            {`Request: ${logData.Request}`}
          </Text>
          <Text
            size="$xs"
            b
            css={{
              ml: 10,
              maxWidth: "250px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {`Operation: ${logData.Operation}`}
          </Text>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default FullLogModal;
