import {
  Button,
  Col,
  Dropdown,
  Input,
  Loading,
  Modal,
  Row,
  Text,
  useModal,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import mainApi from "../../../../../mainApi";
import { DeleteIcon } from "../DeleteIcon";
import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";
import { useState } from "react";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];

type ScratchActionMenuProps = {
  scratchOrg: ScratchOrg;
  setVisibleDetailsModal: (open: boolean) => void;
};

export const CONFIRM_DELETE_TEXT = "⚠️ Click again to confirm!";

function ScratchActionMenu({
  scratchOrg,
  setVisibleDetailsModal,
}: ScratchActionMenuProps) {
  const queryClient = useQueryClient();

  const { mutate: openOrg, isLoading: isOpenOrgLoading } = useMutation(
    (username: string) => mainApi.openOrg(username),
    {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["list-orgs"],
        });
      },
    }
  );
  const {
    mutate: setAliasForOrg,
    isLoading: isSetAliasForOrgLoading,
    isError,
  } = useMutation(
    (alias: string) => mainApi.setAliasForOrg(scratchOrg.username, alias),
    {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["list-orgs"],
        });
        setVisible(false);
      },
    }
  );
  const { mutate: markScratchForDeletion, isLoading: isDeleteOrgLoading } =
    useMutation(
      (username: string) => mainApi.markScratchForDeletion(username),
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["list-orgs"],
          });
        },
      }
    );

  const [hasPressedOnce, setHasPressedOnce] = useState(false);
  const handleConfirmPress = () => {
    setHasPressedOnce(true);
    setTimeout(() => {
      setHasPressedOnce(false);
    }, 2000);
  };

  function handleOnDeletePress() {
    hasPressedOnce
      ? markScratchForDeletion(scratchOrg.orgId)
      : handleConfirmPress();
  }

  function getDeleteButtonText() {
    return hasPressedOnce ? CONFIRM_DELETE_TEXT : "Delete";
  }

  const { setVisible, bindings } = useModal();
  const [newAlias, setNewAlias] = useState("");
  function handleSetAliasPress() {
    if (!!newAlias) {
      setAliasForOrg(newAlias);
    }
  }

  return (
    <>
      <Modal
        open={bindings.open}
        blur
        closeButton
        aria-labelledby="set-alias-modal"
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Col>
            <Text size="$md" b>
              {`Set an alias for org ${scratchOrg.orgId}`}
            </Text>
            {!!scratchOrg.alias && (
              <Text size="$sm">{`Current alias: ${scratchOrg.alias}`}</Text>
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
            {isSetAliasForOrgLoading ? <Loading size="sm" /> : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Row justify="flex-end" align="center" css={{ ml: 10, width: "auto" }}>
        <Dropdown closeOnSelect={false} shouldCloseOnBlur>
          <Dropdown.Button
            flat
            color="primary"
            size="xs"
            css={{ fontSize: "x-small", fontWeight: "$bold", minWidth: "60px" }}
          >
            MORE
          </Dropdown.Button>
          <Dropdown.Menu color="primary" aria-label="Actions">
            <Dropdown.Item
              key="details"
              icon={
                <DeleteIcon size={22} fill="var(--nextui-colors-primary)" />
              }
            >
              <Text
                onClick={() => {
                  console.log("opening details modal");
                  setVisibleDetailsModal(true);
                }}
              >
                See details
              </Text>
            </Dropdown.Item>
            <Dropdown.Item
              key="open"
              icon={
                isOpenOrgLoading ? (
                  <Loading color="currentColor" size="xs" />
                ) : (
                  <DeleteIcon size={22} fill="var(--nextui-colors-primary)" />
                )
              }
            >
              <Text
                color="currentColor"
                onClick={() => openOrg(scratchOrg.username)}
              >
                Open in browser
              </Text>
            </Dropdown.Item>
            <Dropdown.Item
              key="update-alias"
              icon={
                <DeleteIcon size={22} fill="var(--nextui-colors-primary)" />
              }
            >
              <Text onClick={() => setVisible(!bindings.open)}>
                Update alias
              </Text>
            </Dropdown.Item>
            <Dropdown.Item
              withDivider
              key="delete"
              color="error"
              icon={
                isDeleteOrgLoading ? (
                  <Loading color="currentColor" size="xs" />
                ) : (
                  <DeleteIcon size={22} fill="currentColor" />
                )
              }
            >
              <Text color="currentColor" onClick={handleOnDeletePress}>
                {getDeleteButtonText()}
              </Text>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Row>
    </>
  );
}

export default ScratchActionMenu;
