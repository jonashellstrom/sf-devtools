import { Button, Divider, Modal, Text } from "@nextui-org/react";

import type { ListOrgsSuccessResponse } from "../../../../../../shared/sfdxResponses";
import OrgDetailItem from "./OrgDetailItem";

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
  const detailItems = [
    {
      title: "Username",
      value: org.username,
    },
    {
      title: "Instance URL",
      value: org.instanceUrl,
    },
    {
      title: "Org ID (18 char)",
      value: org.orgId,
    },
    {
      title: "Org ID (15 char)",
      value: org.orgId.substring(0, 15),
    },
    {
      title: "Instance Api Version",
      value: org.instanceApiVersion,
    },
    {
      title: "Client ID",
      value: org.clientId,
    },
    {
      title: "Is DevHub?",
      value: org.isDevHub,
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
          {`Details for ${displayName} Org`}
        </Text>
      </Modal.Header>
      <Divider />
      <Modal.Body>
        {detailItems.map((i) => (
          <OrgDetailItem key={i.title} title={i.title} value={`${i.value}`} />
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="primary" onPress={() => setVisible(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrgDetailModal;
