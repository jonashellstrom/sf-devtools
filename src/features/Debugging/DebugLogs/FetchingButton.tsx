import { Badge, Button } from "@nextui-org/react";
import { useState } from "react";

type FetchingButtonProps = {
  isFetching: boolean;
  setIsFetching: (v: boolean) => void;
};

function FetchingButton({ isFetching, setIsFetching }: FetchingButtonProps) {
  const [fetchingCtaText, setFetchingCtaText] = useState("Start Fetching ▶");
  const [isShowingActiveBadge, setIsShowingActiveBade] = useState(false);

  function handleOnMouseEnter() {
    setFetchingCtaText(isFetching ? "Stop Fetching" : "Start Fetching ▶️");
    setIsShowingActiveBade(isFetching ? false : true);
  }

  function handleOnMouseLeave() {
    setFetchingCtaText(isFetching ? "Fetching Now!" : "Start Fetching ▶️");
    setIsShowingActiveBade(isFetching ? true : false);
  }

  return (
    <Button
      size="xs"
      auto
      css={{ ml: 10, mb: 10 }}
      onPress={() => {
        setIsFetching(!isFetching);
        setFetchingCtaText(isFetching ? "Start Fetching ▶️" : "Fetching Now!");
      }}
      // flat
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {fetchingCtaText}
      {isShowingActiveBadge && (
        <Badge color="success" variant="points" css={{ ml: 5 }} />
      )}
    </Button>
  );
}

export default FetchingButton;
