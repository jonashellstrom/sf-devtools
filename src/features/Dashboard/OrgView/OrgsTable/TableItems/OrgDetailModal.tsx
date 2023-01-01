import { Button, Divider, Modal, Table, Text } from "@nextui-org/react";

import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];
type NonScratchOrg =
  ListOrgsSuccessResponse["result"]["nonScratchOrgs"][number];

type OrgDetailModalProps = {
  org: ScratchOrg | NonScratchOrg;
  modalBindings: {
    open: boolean;
    onClose: () => void;
  };
  setVisible: (toggle: boolean) => void;
};

function OrgDetailModal({
  org,
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
      value: org.username,
    },
    {
      key: "2",
      detail: "Instance URL",
      value: org.instanceUrl,
    },
    {
      key: "3",
      detail: "Org ID (18 char)",
      value: org.orgId,
    },
    {
      key: "3",
      detail: "Org ID (15 char)",
      value: org.orgId.substring(0, 15),
    },
  ];

  const displayName = org.alias ? org.alias : "Unaliased";
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
          {`${displayName} Org`}
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
                    {/* @ts-ignore */}
                    {item[columnKey]}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="default" onPress={() => setVisible(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrgDetailModal;
