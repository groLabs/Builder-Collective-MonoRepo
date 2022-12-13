import { Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { selectWalletAccount } from "../../wallet/store/wallet.selectors";

const order = ["first", "second", "third", "fourth"];

export function Stepper({
  step,
  setStep,
}: {
  step: string;
  setStep: (val: string) => void;
}): React.ReactElement {
  const wallet = useSelector(selectWalletAccount);

  const steps = useMemo(() => {
    const currentStepIndex = order.findIndex((elem) => elem === step);
    return { next: currentStepIndex + 1, prev: currentStepIndex - 1 };
  }, [step]);

  const styles = {
    rectangle: css`
      width: 36px;
      height: 4px;

      background: #d9d9d9;
      border-radius: 20px;
      transition: background 0.3s;
    `,
    active: css`
      background: #1976d2;
    `,
    button: css`
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    `,
    disabled: css`
      opacity: 0.5
    `
  };

  const shouldDisableBack = useMemo(() => {
    return (
      step === "first" || (step === "second" && wallet) || step === "fourth"
    );
  }, [step, wallet]);

  const shouldDisableSkip = useMemo(() => {
    return step === 'first' || step === 'fourth'
  }, [step])

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      pt={1.6}
    >
      <Typography
        onClick={() => !shouldDisableBack && setStep(order[steps.prev])}
        css={shouldDisableBack ? styles.disabled : styles.button}
        variant="body2Small"
        fontWeight={500}
      >
        Back
      </Typography>
      <Box display="flex" gap="4px" alignItems="center">
        <Box
          css={
            step === "first"
              ? [styles.rectangle, styles.active]
              : styles.rectangle
          }
        />
        <Box
          css={
            step === "second"
              ? [styles.rectangle, styles.active]
              : styles.rectangle
          }
        />
        <Box
          css={
            step === "third"
              ? [styles.rectangle, styles.active]
              : styles.rectangle
          }
        />
        <Box
          css={
            step === "fourth"
              ? [styles.rectangle, styles.active]
              : styles.rectangle
          }
        />
      </Box>
      <Typography
        css={shouldDisableSkip ? styles.disabled : styles.button}
        variant="body2Small"
        onClick={() => !shouldDisableSkip && setStep(order[steps.next])}
        fontWeight={500}
      >
        Skip
      </Typography>
    </Box>
  );
}
