import React, { useState } from "react";
import {
  Table,
  Row,
  Text,
  User,
  useModal,
  Badge,
  Col,
} from "@nextui-org/react";

import ScratchExpirationBar from "./TableItems/ScratchExpirationBar";
import OrgDetailModal from "./TableItems/OrgDetailModal";
import OrgActions from "./TableItems/OrgActions";
import ScratchActionMenu from "./TableItems/ScratchActionMenu";
import type { ListOrgsSuccessResponse } from "../../../../shared/sfdxResponses";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];

const COLUMNS = [
  { name: "ORG", uid: "org" },
  { name: "STATUS", uid: "status" },
  { name: "EXPIRATION", uid: "expiration" },
  { name: "ACTIONS", uid: "actions" },
];

function sortOrgsByCreatedDate(orgs: ScratchOrg[]) {
  return orgs
    .map((s, idx) => ({
      id: idx,
      ...s,
    }))
    .sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
}

type ScratchesTableProps = {
  orgs: ScratchOrg[];
};

function ScratchesTable({ orgs }: ScratchesTableProps) {
  const scratchOrgs = sortOrgsByCreatedDate(orgs);

  const { setVisible, bindings } = useModal();

  const [detailedScratch, setDetailedScratch] = useState<ScratchOrg>();

  function handleSetDetailedScratch(org: ScratchOrg) {
    setDetailedScratch(org);
    setVisible(true);
  }

  function renderTableCell(org: ScratchOrg, columnKey: React.Key) {
    switch (columnKey) {
      case "org":
        return (
          <>
            <User
              squared
              pointer
              bordered
              text={org.alias?.slice(0, 1) || "U"}
              name={org.alias || "Unaliased Scratch"}
              css={{
                p: 0,
                cursor: "pointer",
                justifyContent: "flex-start",
              }}
              onClick={() => {
                handleSetDetailedScratch(org);
              }}
            >
              {org.orgId}
            </User>
          </>
        );
      case "status":
        return (
          <Row css={{ w: 100 }}>
            <Badge color={org.isExpired ? "error" : "success"} size="xs">
              {org.status}
            </Badge>
          </Row>
        );
      case "expiration":
        return (
          <Row css={{ w: 80 }}>
            <ScratchExpirationBar expirationDate={org.expirationDate} />
          </Row>
        );
      case "actions":
        return (
          <Row justify="flex-end" css={{ width: "auto" }}>
            <OrgActions org={org} />
            <ScratchActionMenu
              scratchOrg={org}
              onSetDetailedScratch={handleSetDetailedScratch}
            />
          </Row>
        );
      default:
        return "";
    }
  }

  return (
    <Col css={{ width: "100%" }}>
      {detailedScratch && (
        <OrgDetailModal
          org={detailedScratch}
          modalBindings={bindings}
          setVisible={setVisible}
        />
      )}
      <Row css={{ width: "100%" }}>
        <Text h5 b>
          Scratch Orgs
        </Text>
      </Row>
      <Table aria-label="table of scratches" shadow={false}>
        <Table.Header columns={COLUMNS}>
          {(column) => (
            <Table.Column
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={scratchOrgs}>
          {(org) => {
            return (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell css={{ fontSize: "x-small" }}>
                    {renderTableCell(org, columnKey)}
                  </Table.Cell>
                )}
              </Table.Row>
            );
          }}
        </Table.Body>
        <Table.Pagination noMargin align="center" rowsPerPage={3} size="sm" />
      </Table>
    </Col>
  );
}

export default ScratchesTable;
