import { Button, Row, Text } from "@nextui-org/react";

import useWithCopyToClipboard from "../../../../../../hooks/useWithCopyToClipboard";

type OrgDetailItemProps = {
  title: string;
  value: string;
};
function OrgDetailItem({ title, value }: OrgDetailItemProps) {
  const { handleOnCopyPress, CopyToClipboardWrapper } =
    useWithCopyToClipboard();

  return (
    <Row css={{ width: "100%" }}>
      <Text css={{ fontWeight: "$bold", width: "25%" }}>{title}</Text>

      <Text css={{ width: "60%" }}>{value}</Text>
      <Row justify="flex-end" css={{ width: "15%" }}>
        <CopyToClipboardWrapper>
          <Button
            flat
            onPress={() => handleOnCopyPress(value)}
            color="primary"
            auto
            css={{ borderRadius: 5 }}
            size="xs"
          >
            Copy
          </Button>
        </CopyToClipboardWrapper>
      </Row>
    </Row>
  );
}

export default OrgDetailItem;
