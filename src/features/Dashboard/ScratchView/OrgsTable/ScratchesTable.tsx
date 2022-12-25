import React, { useState } from "react";
import {
  Table,
  Row,
  Text,
  Loading,
  User,
  useModal,
  Badge,
  Col,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";

import queries from "../../../../mainApi";
import ScratchExpirationBar from "./ScratchExpirationBar";
import OrgDetailModal from "./OrgDetailModal";
import ScratchActions from "./TableItems/ScratchActions";
import ScratchActionMenu from "./TableItems/ScratchActionMenu";
import type { ListOrgsSuccessResponse } from "../../../../shared/sfdxResponses";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];

const COLUMNS = [
  { name: "ORG", uid: "org" },
  { name: "STATUS", uid: "status" },
  { name: "EXPIRATION", uid: "expiration" },
  { name: "ACTIONS", uid: "actions" },
];

function ScratchesTable() {
  // TODO: handle errors
  const { data, isLoading } = useQuery(["list-orgs"], queries.listOrgs);

  const scratchOrgs = data?.result.scratchOrgs
    .map((s, idx) => ({
      id: idx,
      ...s,
    }))
    .sort((a, b) => (a.createdDate > b.createdDate ? -1 : 1));
  const { setVisible, bindings } = useModal();

  const [detailedScratch, setDetailedScratch] = useState<ScratchOrg>();

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
                setDetailedScratch(org);
                setVisible(true);
              }}
            >
              {org.orgId}
            </User>
          </>
        );
      case "status":
        return (
          <Row css={{ w: 80 }}>
            <Badge color={org.isExpired ? "error" : "success"} size="xs">
              {org.status.toLocaleUpperCase()}
            </Badge>
          </Row>
        );
      case "expiration":
        return (
          <Row css={{ w: 90 }}>
            <ScratchExpirationBar expirationDate={org.expirationDate} />
          </Row>
        );
      case "actions":
        return (
          <Row justify="flex-end" css={{ width: "auto" }}>
            <ScratchActions scratchOrg={org} />
            <ScratchActionMenu
              scratchOrg={org}
              setVisibleDetailsModal={setVisible}
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
          scratchItem={detailedScratch}
          modalBindings={bindings}
          setVisible={setVisible}
        />
      )}
      <Row css={{ width: "100%" }}>
        <Text h5 b>
          Scratch Orgs
        </Text>
      </Row>
      {isLoading ? (
        <Loading
          color="primary"
          textColor="primary"
          type="points"
          css={{ pt: 30, width: "100%" }}
          size="md"
        >
          <Text css={{ pt: 15 }}>Getting orgs...</Text>
        </Loading>
      ) : (
        <Table aria-label="table of scratches" shadow={false}>
          <Table.Header columns={COLUMNS}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
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
      )}
    </Col>
  );
}

export default ScratchesTable;
