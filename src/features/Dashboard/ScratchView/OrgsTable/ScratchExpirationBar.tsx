import {
  Container,
  Progress,
  Text,
  type ProgressProps,
} from "@nextui-org/react";
import { DateTime } from "luxon";

type ScratchExpirationBarProps = { expirationDate: string };

function getColorBasedOnExpiration(percentage: number): ProgressProps["color"] {
  if (percentage < 0.2) return "error";
  else if (percentage < 0.4) return "warning";
  else return "success";
}

function ScratchExpirationBar({ expirationDate }: ScratchExpirationBarProps) {
  const date = DateTime.fromSQL(expirationDate);
  const remainingPercentage = date.diffNow("days").days / 30;

  return (
    <Container gap={0} direction="column" alignItems="flex-end">
      <Text size="x-small">{`${expirationDate}`}</Text>
      <Progress
        size="xs"
        value={remainingPercentage * 100}
        color={getColorBasedOnExpiration(remainingPercentage)}
      />
      {remainingPercentage < 0 ? (
        <Text size="x-small">{`Expired`}</Text>
      ) : (
        <Text size="x-small">{`Expires ${date.toRelative()}`}</Text>
      )}
    </Container>
  );
}

export default ScratchExpirationBar;
