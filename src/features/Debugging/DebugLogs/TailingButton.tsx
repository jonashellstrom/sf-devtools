import { Badge, Button } from "@nextui-org/react";
import { useState } from "react";

type TailingButtonProps = {
  isTailing: boolean;
  setIsTailing: (v: boolean) => void;
};

function TailingButton({ isTailing, setIsTailing }: TailingButtonProps) {
  const [tailingCtaText, setTailingCtaText] = useState("Start Tailing ▶");
  const [isShowingActiveBadge, setIsShowingActiveBade] = useState(false);

  function handleOnMouseEnter() {
    setTailingCtaText(isTailing ? "Stop Tailing" : "Start Tailing ▶️");
    setIsShowingActiveBade(isTailing ? false : true);
  }

  function handleOnMouseLeave() {
    setTailingCtaText(isTailing ? "Tailing Now!" : "Start Tailing ▶️");
    setIsShowingActiveBade(isTailing ? true : false);
  }

  return (
    <Button
      size="xs"
      auto
      css={{ ml: 10, mb: 10 }}
      onPress={() => {
        setIsTailing(!isTailing);
        setTailingCtaText(isTailing ? "Start Tailing ▶️" : "Tailing Now!");
      }}
      color={isTailing ? "success" : "default"}
      flat
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {tailingCtaText}
      {isShowingActiveBadge && (
        <Badge color="success" variant="points" css={{ ml: 5 }} />
      )}
    </Button>
  );
}

export default TailingButton;
