import {
  Button,
  Col,
  Divider,
  Modal,
  Table,
  Text,
  Tooltip,
} from "@nextui-org/react";

import { type TScratchItem } from "../types";
import { EditIcon } from "./EditIcon";
import { IconButton } from "./IconButton";
import useWithCopyToClipboard from "../../../../hooks/useWithCopyToClipboard";

type OrgDetailModalProps = {
  scratchItem: TScratchItem;
  modalBindings: {
    open: boolean;
    onClose: () => void;
  };
  setVisible: (toggle: boolean) => void;
};

function OrgDetailModal({
  scratchItem,
  modalBindings,
  setVisible,
}: OrgDetailModalProps) {
  const columns = [
    {
      key: "detail",
      label: "DETAIL",
    },
    {
      key: "value",
      label: "",
    },
  ];
  const rows = [
    {
      key: "1",
      detail: "Username",
      value: scratchItem.username,
    },
    {
      key: "2",
      detail: "Instance URL",
      value: scratchItem.instanceUrl,
    },
    {
      key: "3",
      detail: "Org ID (18 char)",
      value: scratchItem.orgId,
    },
    {
      key: "3",
      detail: "Org ID (15 char)",
      value: scratchItem.orgId.substring(0, 15),
    },
  ];
  const { handleOnPress, CopyToClipboardWrapper } = useWithCopyToClipboard();

  const displayName = scratchItem.alias ? scratchItem.alias : "Unaliased";
  return (
    <Modal
      scroll
      width="800px"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...modalBindings}
    >
      <Modal.Header>
        <Text b size={18}>
          {`${displayName} Scratch`}
        </Text>
      </Modal.Header>
      <Divider />
      <Modal.Body>
        <Table
          aria-label="Scratch details table"
          css={{
            height: "auto",
            minWidth: "100%",
          }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.key}>{column.label}</Table.Column>
            )}
          </Table.Header>
          <Table.Body items={rows}>
            {(item) => (
              <Table.Row key={item.key}>
                {(columnKey) => (
                  <Table.Cell>
                    <CopyToClipboardWrapper>
                      <Text
                        // @ts-ignore
                        onPress={async () =>
                          // @ts-ignore
                          await handleOnPress(item[columnKey])
                        }
                      >
                        {/* @ts-ignore */}
                        {item[columnKey]}
                      </Text>
                    </CopyToClipboardWrapper>
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Col css={{ d: "flex" }}>
          <Tooltip
            content="Copy to clipboard"
            css={{ zIndex: "10000 !important" }}
          >
            <IconButton onClick={() => console.log("Edit user")}>
              <EditIcon size={20} fill="#979797" />
            </IconButton>
          </Tooltip>
        </Col>
        <Button auto flat color="default" onPress={() => setVisible(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrgDetailModal;
