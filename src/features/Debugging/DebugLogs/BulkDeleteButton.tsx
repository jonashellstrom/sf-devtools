import { Button, Loading } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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

  const [hasPressedOnce, setHasPressedOnce] = useState(false);

  const handleConfirmPress = () => {
    setHasPressedOnce(true);
    setTimeout(() => {
      setHasPressedOnce(false);
    }, 2000);
  };

  return (
    <Button
      size="xs"
      auto
      color="error"
      css={{ fontSize: "x-small", fontWeight: "$bold" }}
      onPress={() => {
        hasPressedOnce ? bulkDeleteLogs() : handleConfirmPress();
      }}
      flat
      disabled={isDisabled}
    >
      {isBulkDeleteLogsLoading ? (
        <Loading color="currentColor" size="xs" />
      ) : hasPressedOnce ? (
        "⚠️ CLICK TO CONFIRM!"
      ) : (
        "DELETE ALL LOGS"
      )}
    </Button>
  );
}

export default BulkDeleteButton;
