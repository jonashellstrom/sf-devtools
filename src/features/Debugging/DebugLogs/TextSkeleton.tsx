import { Row, Text } from "@nextui-org/react";
import Skeleton from "../../../components/Skeleton";

type TextSkeletonProps = {
  width: number;
  height?: number;
  emoji?: string;
};
function TextSkeleton({ width, height = 15, emoji }: TextSkeletonProps) {
  return (
    <Row>
      {emoji && (
        <Text size="$xs" b css={{ mr: 5 }}>
          {emoji}
        </Text>
      )}
      <Skeleton width={width} height={height} marginTop={-5} />
    </Row>
  );
}

export default TextSkeleton;
