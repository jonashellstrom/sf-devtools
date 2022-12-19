import RSkeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SkeletonProps = {
  height?: number;
  width?: number;
  marginTop?: number;
};
function Skeleton({ height = 97, width, marginTop = -10 }: SkeletonProps) {
  return (
    <RSkeleton
      count={1}
      height={`${height}px`}
      width={width && `${width}px`}
      style={{
        borderRadius: 15,
        marginBottom: 15,
        marginTop,
        border: "0.5px solid grey",
      }}
    />
  );
}

export default Skeleton;
