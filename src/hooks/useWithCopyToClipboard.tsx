import { Grid, Popover, Text } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import useCopyToClipboard from "./useCopyToClipboard";

function useWithCopyToClipboard(hidePopoverAfter: number = 3000) {
  const copyToClipboard = useCopyToClipboard();
  const [isOpen, setIsOpen] = useState(false);

  const handleOnCopyPress = useCallback(
    async (textToCopy: string) => {
      await copyToClipboard(textToCopy);
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), hidePopoverAfter);
    },
    [copyToClipboard, hidePopoverAfter]
  );

  const CopyToClipboardWrapper = useMemo(() => {
    return ({ children }: { children: React.ReactElement }) => (
      <Grid>
        <Popover isOpen={isOpen} onOpenChange={setIsOpen} isBordered>
          <Popover.Trigger>{children}</Popover.Trigger>
          <Popover.Content>
            <Text css={{ p: "$8" }} size="sm">
              Copied to clipboard!
            </Text>
          </Popover.Content>
        </Popover>
      </Grid>
    );
  }, [isOpen]);

  return { CopyToClipboardWrapper, handleOnCopyPress };
}

export default useWithCopyToClipboard;
