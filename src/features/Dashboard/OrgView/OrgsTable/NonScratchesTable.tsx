import React from "react";
import { Table, Row, Text, User, Col, Badge } from "@nextui-org/react";

import { ListOrgsSuccessResponse } from "../../../../shared/sfdxResponses";
import NonScratchActionMenu from "./TableItems/NonScratchActionMenu";
import OrgActions from "./TableItems/OrgActions";

type NonScratchOrg =
  ListOrgsSuccessResponse["result"]["nonScratchOrgs"][number];

const COLUMNS = [
  { name: "ORG", uid: "org" },
  { name: "STATUS", uid: "status" },
  { name: "TYPE", uid: "type" },
  { name: "ACTIONS", uid: "actions" },
];

type NonScratchesTableProps = {
  orgs: NonScratchOrg[];
};

function NonScratchesTable({ orgs }: NonScratchesTableProps) {
  const nonScratchOrgs = orgs.map((s, idx) => ({
    id: idx,
    ...s,
  }));

  function renderTableCell(org: NonScratchOrg, columnKey: React.Key) {
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
            >
              {org.orgId}
            </User>
          </>
        );
      case "status":
        return (
          <Row css={{ w: 100 }}>
            <Badge
              size="xs"
              color={
                org.connectedStatus.toLowerCase() === "connected"
                  ? "success"
                  : "warning"
              }
            >{`${org.connectedStatus}`}</Badge>
          </Row>
        );
      case "type":
        return (
          <Row css={{ w: 80 }}>
            <Badge size="xs" color="primary">
              {org.isDevHub ? "DevHub" : "Non-DevHub"}
            </Badge>
          </Row>
        );
      case "actions":
        return (
          <Row justify="flex-end" align="center" css={{ pl: 5 }}>
            <OrgActions org={org} />
            <NonScratchActionMenu org={org} />
          </Row>
        );
      default:
        return "";
    }
  }

  return (
    <Col>
      <Row>
        <Text h5 b>
          Non-Scratch Orgs
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
        <Table.Body items={nonScratchOrgs}>
          {(org) => {
            return (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{renderTableCell(org, columnKey)}</Table.Cell>
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

export default NonScratchesTable;
