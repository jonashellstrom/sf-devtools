import { Dropdown, Loading, Row, Text } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ActionButton, {
  DEFAULT_CONFIRM_TEXT,
} from "../../../../../components/ActionButton";
import mainApi from "../../../../../mainApi";
import { DeleteIcon } from "../DeleteIcon";
import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];

type ScratchActionMenuProps = {
  scratchOrg: ScratchOrg;
};

function ScratchActionMenu({ scratchOrg }: ScratchActionMenuProps) {
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
  const { mutate: markScratchForDeletion, isLoading: isMutationLoading } =
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

  const { mutate: setDefaultOrg, isLoading: isSetDefaultOrgLoading } =
    useMutation((orgUsername: string) => mainApi.setDefaultOrg(orgUsername), {
      onSuccess() {
        queryClient.invalidateQueries(["current-user"]);
      },
    });

  return (
    <Row justify="flex-end" align="center" css={{ ml: 10 }}>
      <Dropdown>
        <Dropdown.Button
          flat
          color="primary"
          size="xs"
          css={{ fontSize: "x-small", fontWeight: "$bold", minWidth: "60px" }}
        >
          {isOpenOrgLoading || isMutationLoading ? (
            <Loading color="currentColor" size="xs" />
          ) : (
            "MORE"
          )}
        </Dropdown.Button>
        <Dropdown.Menu color="secondary" aria-label="Actions">
          <Dropdown.Item
            key="details"
            icon={
              <DeleteIcon size={22} fill="var(--nextui-colors-secondary)" />
            }
          >
            See details
          </Dropdown.Item>
          <Dropdown.Item
            key="open"
            icon={
              <DeleteIcon size={22} fill="var(--nextui-colors-secondary)" />
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
            key="make-default"
            icon={
              <DeleteIcon size={22} fill="var(--nextui-colors-secondary)" />
            }
          >
            Make default
          </Dropdown.Item>
          <Dropdown.Item
            key="update-alias"
            icon={
              <DeleteIcon size={22} fill="var(--nextui-colors-secondary)" />
            }
          >
            Update alias
          </Dropdown.Item>
          <Dropdown.Item
            withDivider
            key="delete"
            color="error"
            icon={<DeleteIcon size={22} fill="currentColor" />}
          >
            <Text color="currentColor">Delete</Text>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Row>
  );
}

export default ScratchActionMenu;
