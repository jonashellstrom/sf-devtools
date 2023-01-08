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
  const isDefault = org.isDefaultUsername;
  const queryClient = useQueryClient();

  const { mutate: setDefaultOrg, isLoading: isSetDefaultOrgLoading } =
    useMutation((orgUsername: string) => mainApi.setDefaultOrg(orgUsername), {
      async onSuccess() {
        await queryClient.invalidateQueries([queryKeys.CURRENT_USER]);
        await queryClient.invalidateQueries([queryKeys.TRACE_FLAGS]);
        await queryClient.invalidateQueries([queryKeys.LIST_ORGS]);
      },
    });

  return (
    <Row css={{ width: "auto" }}>
      <ActionButton
        text={isDefault ? "DEFAULT" : "MAKE DEFAULT"}
        minWidth={100}
        isLoading={isSetDefaultOrgLoading}
        isDisabled={isDefault || isSetDefaultOrgLoading}
        onPress={() => setDefaultOrg(org.username)}
        withTooltip={{
          tooltipText: isDefault
            ? "This is your default SFDX org"
            : "Set this org as your default SFDX org",
        }}
      />
    </Row>
  );
}

export default OrgActions;
