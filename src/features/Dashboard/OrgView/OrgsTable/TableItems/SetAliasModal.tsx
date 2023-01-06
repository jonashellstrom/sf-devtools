import { useState } from "react";
import {
  Button,
  Col,
  Input,
  Loading,
  Modal,
  Row,
  Text,
  Tooltip,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import mainApi from "../../../../../mainApi";
import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";
import queryKeys from "../../../../../shared/queryKeys";

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
          queryKey: [queryKeys.LIST_ORGS],
        });
        setVisible(false);
      },
    }
  );

  const {
    mutate: unsetAliasForOrg,
    isLoading: isUnsetAliasForOrgLoading,
    isError: isUnsetAliasForOrgError,
  } = useMutation((alias: string) => mainApi.unsetAliasForOrg(alias), {
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.LIST_ORGS],
      });
      setVisible(false);
    },
  });

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
            {`Set an SFDX CLI alias for org ${org.orgId}`}
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
          labelPlaceholder="New SFDX CLI Alias"
          color="primary"
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSetAliasPress();
            }
          }}
        />
        {isUnsetAliasForOrgError && (
          <Text
            size="$sm"
            color="error"
          >{`⛔️ Something went wrong unsetting alias`}</Text>
        )}
        {isError && (
          <Text
            size="$sm"
            color="error"
          >{`⛔️ Something went wrong updating alias`}</Text>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Row justify="space-between">
          <Tooltip
            content={`Unset CLI alias "${org.alias}" for this org`}
            color="error"
            css={{ zIndex: "10000000 !important" }}
          >
            <Button
              auto
              onPress={() => unsetAliasForOrg(org.alias)}
              color="error"
              disabled={isUnsetAliasForOrgLoading}
            >
              {isUnsetAliasForOrgLoading ? (
                <Loading size="sm" />
              ) : (
                "Unset alias"
              )}
            </Button>
          </Tooltip>
          <Button
            auto
            onPress={handleSetAliasPress}
            color="primary"
            disabled={!newAlias || isSetAliasForOrgLoading}
          >
            {isSetAliasForOrgLoading ? <Loading size="sm" /> : "Set alias"}
          </Button>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default SetAliasModal;
