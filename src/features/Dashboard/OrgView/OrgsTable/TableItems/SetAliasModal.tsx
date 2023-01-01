import { useState } from "react";
import { Button, Col, Input, Loading, Modal, Text } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import mainApi from "../../../../../mainApi";
import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];
type NonScratchOrg =
  ListOrgsSuccessResponse["result"]["nonScratchOrgs"][number];

type SetAliasModalProps = {
  org: ScratchOrg | NonScratchOrg;
  modalBindings: {
    open: boolean;
    onClose: () => void;
  };
  setVisible: (toggle: boolean) => void;
};

function SetAliasModal({ org, modalBindings, setVisible }: SetAliasModalProps) {
  const queryClient = useQueryClient();

  const {
    mutate: setAliasForOrg,
    isLoading: isSetAliasForOrgLoading,
    isError,
  } = useMutation(
    (alias: string) => mainApi.setAliasForOrg(org.username, alias),
    {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["list-orgs"],
        });
        setVisible(false);
      },
    }
  );

  const [newAlias, setNewAlias] = useState("");
  function handleSetAliasPress() {
    if (!!newAlias) {
      setAliasForOrg(newAlias);
    }
  }

  return (
    <Modal
      open={modalBindings.open}
      blur
      closeButton
      aria-labelledby="set-alias-modal"
      onClose={() => setVisible(false)}
    >
      <Modal.Header>
        <Col>
          <Text size="$md" b>
            {`Set an alias for org ${org.orgId}`}
          </Text>
          {!!org.alias && (
            <Text size="$sm">{`Current alias: ${org.alias}`}</Text>
          )}
        </Col>
      </Modal.Header>
      <Modal.Body css={{ pt: 30 }}>
        <Input
          bordered
          clearable
          labelPlaceholder="New Alias"
          color="primary"
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSetAliasPress();
            }
          }}
        />
        {isError && (
          <Text
            size="$sm"
            color="error"
          >{`⛔️ Something went wrong updating alias`}</Text>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          onPress={handleSetAliasPress}
          color="primary"
          disabled={!newAlias}
        >
          {isSetAliasForOrgLoading ? <Loading size="sm" /> : "Set alias"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SetAliasModal;
