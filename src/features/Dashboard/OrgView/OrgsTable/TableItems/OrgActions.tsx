import { Row } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ActionButton from "../../../../../components/ActionButton";

import mainApi from "../../../../../mainApi";
import queryKeys from "../../../../../shared/queryKeys";
import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];
type NonScratchOrg =
  ListOrgsSuccessResponse["result"]["nonScratchOrgs"][number];

type OrgActionsProps = {
  org: ScratchOrg | NonScratchOrg;
};

function OrgActions({ org }: OrgActionsProps) {
  const queryClient = useQueryClient();

  const { mutate: setDefaultOrg, isLoading: isSetDefaultOrgLoading } =
    useMutation((orgUsername: string) => mainApi.setDefaultOrg(orgUsername), {
      onSuccess() {
        queryClient.invalidateQueries(["current-user"]);
        queryClient.invalidateQueries([queryKeys.TRACE_FLAGS]);
      },
    });

  return (
    <Row css={{ width: "auto" }}>
      <ActionButton
        text="MAKE DEFAULT"
        minWidth={100}
        isLoading={isSetDefaultOrgLoading}
        isDisabled={isSetDefaultOrgLoading}
        onPress={() => setDefaultOrg(org.username)}
        withTooltip={{
          tooltipText: "Set this org as your default SFDX org",
        }}
      />
    </Row>
  );
}

export default OrgActions;
