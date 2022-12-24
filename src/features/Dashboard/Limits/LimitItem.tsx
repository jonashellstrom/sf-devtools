import { Text, Progress, ProgressProps, Col } from "@nextui-org/react";

type LimitItemProps = {
  name: string;
  max: number;
  remaining: number;
};

function getProgressColor(
  consumptionPercentage: number
): ProgressProps["color"] {
  if (consumptionPercentage < 30) return "warning";
  else if (consumptionPercentage < 10) return "error";
  else return "success";
}

const WIDTH = "260px";

function LimitItem({ name, max, remaining }: LimitItemProps) {
  const consumptionPercentage = Math.round((remaining / max) * 100);

  return (
    <>
      <Col
        css={{
          width: WIDTH,
          mb: 20,
          mr: 20,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        <Text b size="small" css={{}}>
          {name}
        </Text>
        <Col>
          <Progress
            value={consumptionPercentage}
            color={getProgressColor(consumptionPercentage)}
            css={{ width: WIDTH, bg: "White", height: "3px" }}
            size="xs"
          />
          <Text size="small">{`${remaining} / ${max} remaining`}</Text>
        </Col>
      </Col>
    </>
  );
}

export default LimitItem;
