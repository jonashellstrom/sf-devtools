import RSkeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SkeletonProps = {
  height?: number;
};
function Skeleton({ height = 97 }: SkeletonProps) {
  return (
    <RSkeleton
      count={1}
      height={`${height}px`}
      style={{
        borderRadius: 15,
        marginBottom: 15,
        marginTop: -10,
        border: "0.5px solid grey",
      }}
    />
  );
}

export default Skeleton;
