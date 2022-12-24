import { Row } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ActionButton from "../../../../../components/ActionButton";

import mainApi from "../../../../../mainApi";
import type { ListOrgsSuccessResponse } from "../../../../../shared/sfdxResponses";

type ScratchOrg = ListOrgsSuccessResponse["result"]["scratchOrgs"][number];

type ScratchActionsProps = {
  scratchOrg: ScratchOrg;
};

function ScratchActions({ scratchOrg }: ScratchActionsProps) {
  const queryClient = useQueryClient();

  const { mutate: setDefaultOrg, isLoading: isSetDefaultOrgLoading } =
    useMutation((orgUsername: string) => mainApi.setDefaultOrg(orgUsername), {
      onSuccess() {
        queryClient.invalidateQueries(["current-user"]);
      },
    });

  return (
    <Row justify="flex-end" align="center" css={{ ml: 10 }}>
      <ActionButton
        text="MAKE DEFAULT"
        minWidth={100}
        isLoading={isSetDefaultOrgLoading}
        isDisabled={isSetDefaultOrgLoading}
        onPress={() => setDefaultOrg(scratchOrg.username)}
        withTooltip={{
          tooltipText: "Set this scratch as default SFDX org",
        }}
      />
    </Row>
  );
}

export default ScratchActions;
