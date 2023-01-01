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
  else return "secondary";
}

function ScratchExpirationBar({ expirationDate }: ScratchExpirationBarProps) {
  const date = DateTime.fromSQL(expirationDate);
  const remainingPercentage = date.diffNow("days").days / 30;

  return (
    <Container gap={0} direction="column" alignItems="flex-end">
      <Text size="small">{`${expirationDate}`}</Text>
      <Progress
        value={remainingPercentage * 100}
        color={getColorBasedOnExpiration(remainingPercentage)}
        css={{
          border: "0.5px solid #ccc",
          height: "5px",
        }}
      />
      {remainingPercentage < 0 ? (
        <Text size="small">{`Expired`}</Text>
      ) : (
        <Text size="small">{`Expires ${date.toRelative()}`}</Text>
      )}
    </Container>
  );
}

export default ScratchExpirationBar;
