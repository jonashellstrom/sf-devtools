import { useState } from "react";
import { Dropdown, Loading, Row, Text, useModal } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

import mainApi from "../../../../../mainApi";
import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";
import OrgDetailModal from "./OrgDetailModal/OrgDetailModal";
import SetAliasModal from "./SetAliasModal";

type NonScratchOrg =
  ListOrgsSuccessResponse["result"]["nonScratchOrgs"][number];

type NonScratchActionMenuProps = {
  org: NonScratchOrg;
};

function NonScratchActionMenu({ org }: NonScratchActionMenuProps) {
  const { mutate: openOrg, isLoading: isOpenOrgLoading } = useMutation(
    (username: string) => mainApi.openOrg(username)
  );

  const { setVisible: setVisibleAliasModal, bindings: aliasModalBindings } =
    useModal();
  const { setVisible: setVisibleOrgDetail, bindings: orgDetailBindings } =
    useModal();

  const [detailedOrg, setDetailedOrg] = useState<NonScratchOrg>();
  function handleSetDetailedOrg(org: NonScratchOrg) {
    setDetailedOrg(org);
    setVisibleOrgDetail(true);
  }

  return (
    <>
      {detailedOrg && (
        <OrgDetailModal
          org={detailedOrg}
          modalBindings={orgDetailBindings}
          setVisible={setVisibleOrgDetail}
        />
      )}
      <SetAliasModal
        org={org}
        modalBindings={aliasModalBindings}
        setVisible={setVisibleAliasModal}
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
                  handleSetDetailedOrg(org);
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
              <Text color="currentColor" onClick={() => openOrg(org.username)}>
                Open in browser
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="update-alias">
              <Text
                onClick={() => setVisibleAliasModal(!aliasModalBindings.open)}
              >
                Update CLI alias
              </Text>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Row>
    </>
  );
}

export default NonScratchActionMenu;
