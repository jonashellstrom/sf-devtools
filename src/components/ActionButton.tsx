import { useState } from "react";
import {
  Button,
  ButtonProps,
  Loading,
  Tooltip,
  TooltipProps,
} from "@nextui-org/react";

export const DEFAULT_CONFIRM_TEXT = "⚠️ CLICK TO CONFIRM!";

type ConfirmPressProps = {
  confirmText: string;
  resetDelay?: number;
};

type ButtonTooltipProps = {
  tooltipText: string;
};

type ActionButtonProps = {
  text: string;
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  color?: ButtonProps["color"];
  minWidth?: number;
  withConfirmPress?: ConfirmPressProps;
  withTooltip?: ButtonTooltipProps;
};

function ActionButton({
  text,
  onPress,
  isDisabled,
  isLoading,
  color = "primary",
  minWidth,
  withConfirmPress,
  withTooltip,
}: ActionButtonProps) {
  const [hasPressedOnce, setHasPressedOnce] = useState(false);
  const handleConfirmPress = () => {
    setHasPressedOnce(true);
    setTimeout(() => {
      setHasPressedOnce(false);
    }, withConfirmPress?.resetDelay || 2000);
  };

  function handleOnPress() {
    if (withConfirmPress) {
      hasPressedOnce ? onPress() : handleConfirmPress();
    } else {
      onPress();
    }
  }

  function getButtonText() {
    if (withConfirmPress) {
      return hasPressedOnce ? withConfirmPress.confirmText : text;
    } else {
      return text;
    }
  }

  return (
    <Tooltip
      content={withTooltip?.tooltipText}
      color={color as TooltipProps["color"]}
      css={{
        display: withTooltip ? "initial" : "none",
      }}
    >
      <Button
        onPress={handleOnPress}
        disabled={isDisabled}
        color={color}
        css={{
          ml: 5,
          mr: 5,
          fontSize: "x-small",
          fontWeight: "$bold",
          minWidth,
        }}
        size="xs"
        auto
        flat
      >
        {isLoading ? (
          <Loading color="currentColor" size="xs" />
        ) : (
          getButtonText()
        )}
      </Button>
    </Tooltip>
  );
}

export default ActionButton;
