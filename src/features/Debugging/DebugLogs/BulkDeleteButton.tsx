import { Button, Loading } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import mainApi from "../../../mainApi";
import queryKeys from "../../../shared/queryKeys";

type BulkDeleteButtonProps = {
  isDisabled: boolean;
};

function BulkDeleteButton({ isDisabled }: BulkDeleteButtonProps) {
  const queryClient = useQueryClient();

  const { mutate: bulkDeleteLogs, isLoading: isBulkDeleteLogsLoading } =
    useMutation(() => mainApi.bulkDeleteLogs(), {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: [queryKeys.LIST_LOGS] });
      },
    });

  return (
    <Button
      size="xs"
      auto
      color="error"
      onPress={() => bulkDeleteLogs()}
      flat
      disabled={isDisabled}
    >
      {isBulkDeleteLogsLoading ? (
        <Loading color="currentColor" size="xs" />
      ) : (
        "Delete All Logs"
      )}
    </Button>
  );
}

export default BulkDeleteButton;
