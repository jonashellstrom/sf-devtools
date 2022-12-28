import React, { useEffect, useRef, useState } from "react";

type CollapseProps = {
  isOpen: boolean;
  initialHeight: number;
  marginBottom?: number;
};

function CollapsingWrapper({
  isOpen = true,
  initialHeight,
  marginBottom,
  children,
}: React.PropsWithChildren<CollapseProps>) {
  const [height, setHeight] = useState(`${initialHeight}rem`);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && ref.current) {
      const childHeightRaw = ref.current.clientHeight;
      const childHeight = `${childHeightRaw / 16}rem`;
      setHeight(childHeight);
    }
  }, []);

  return (
    <div
      className={isOpen ? "" : "collapse"}
      style={{
        maxHeight: isOpen ? height : 0,
        marginBottom,
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

export default CollapsingWrapper;
