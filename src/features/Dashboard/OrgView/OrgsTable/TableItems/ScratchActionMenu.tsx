import { useState } from "react";
import { Dropdown, Loading, Row, Text, useModal } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import mainApi from "../../../../../mainApi";
import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";
import SetAliasModal from "./SetAliasModal";
import { DeleteIcon } from "../../../../../components/icons/DeleteIcon";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];

type ScratchActionMenuProps = {
  scratchOrg: ScratchOrg;
  onSetDetailedScratch: (org: ScratchOrg) => void;
};

export const CONFIRM_DELETE_TEXT = "⚠️ Click again to confirm!";

function ScratchActionMenu({
  scratchOrg,
  onSetDetailedScratch,
}: ScratchActionMenuProps) {
  const queryClient = useQueryClient();

  const { mutate: openOrg, isLoading: isOpenOrgLoading } = useMutation(
    (username: string) => mainApi.openOrg(username)
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

  return (
    <>
      <SetAliasModal
        org={scratchOrg}
        modalBindings={bindings}
        setVisible={setVisible}
      />

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
            <Dropdown.Item key="details">
              <Text
                onClick={() => {
                  onSetDetailedScratch(scratchOrg);
                }}
              >
                See details
              </Text>
            </Dropdown.Item>
            <Dropdown.Item
              key="open"
              icon={
                isOpenOrgLoading && <Loading color="currentColor" size="xs" />
              }
            >
              <Text
                color="currentColor"
                onClick={() => openOrg(scratchOrg.username)}
              >
                Open in browser
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="update-alias">
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
                  <DeleteIcon size={18} fill="currentColor" />
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
