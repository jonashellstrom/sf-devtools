import { Modal, Row, Text } from "@nextui-org/react";
import { DateTime } from "luxon";

import { type GetLogResponse } from "../../../../shared/sfdxResponses";
import utils from "../../../../shared/utils";
import CodeEditor from "../../../ApexEditor/CodeEditor";

type FullLogModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  log: GetLogResponse | undefined;
};

function FullLogModal({ isModalOpen, setIsModalOpen, log }: FullLogModalProps) {
  const logs = log?.result[0].log || "";
  const debugLinesOnly = utils.getOnlyDebugLogLines(logs);

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
            {`Log Group: ${log?.logData.Id}`}
          </Text>
          <Row justify="flex-end">
            <Text size="$xs" b>
              {`💻 ${log?.logData.Application}`}
            </Text>
            <Text size="$xs" b css={{ ml: 10 }}>
              {`📤 ${log?.logData.Request}`}
            </Text>
            <Text
              size="$xs"
              b
              css={{
                ml: 10,
                maxWidth: "120px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {`🗂 ${log?.logData.Operation}`}
            </Text>
            <Text size="$xs" b css={{ ml: 10 }}>
              {log
                ? `⏱ ${DateTime.fromISO(log.logData.StartTime).toFormat(
                    "LLL d, yyyy 'at' h:mm:ss a"
                  )}`
                : "..."}
            </Text>
          </Row>
        </Row>
      </Modal.Header>
      <Modal.Body css={{ pt: 10 }}>
        <CodeEditor
          language="apex"
          code={debugLinesOnly}
          placeholder={"No debug logs"}
          isDisabled
          minHeight={530}
        />
      </Modal.Body>
    </Modal>
  );
}

export default FullLogModal;
