import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useFormatedAddress } from "../../../wallet/hooks/useFormattedAddress";
import placeholder from "../../../scCreator/assets/placeholder.png";
import { Controller } from "react-hook-form";
import BigNumber from "bignumber.js";
import { formatPct } from "../../../../utils";
import close from "../../../scCreator/assets/close.png";
import { css } from "@emotion/react";
import { MaskedTextField } from "../../../../components/MaskedTextField";

type CollectiveTableRowProps = {
  user: {
    address: string;
    name: string;
  };
  register: any;
  index: number;
  errors: any;
  control: any;
  setValue: any;
  calculateTVL: any;
  tvl: number;
  remove: any;
};

type CustomEvent = React.ChangeEvent<HTMLInputElement> & {
  target: { rawValue: string };
};

export function CollectiveTableRow({
  user,
  register,
  index,
  setValue,
  tvl,
  errors,
  control,
  calculateTVL,
  remove,
}: CollectiveTableRowProps): React.ReactElement {
  const cursor = css`
    cursor: pointer;
  `;

  const formattedAddress = useFormatedAddress(user.address);
  const [price, setPrice] = useState(0);
  const [value, setTokenValue] = useState(0);

  const amount = useMemo(() => {
    return value / price;
  }, [price, value]);

  const allocation = useMemo(() => {
    if (!value || isNaN(value)) return new BigNumber(0);

    return new BigNumber(value / tvl);
  }, [value, tvl]);

  useEffect(() => {
    setValue(`participants.${index}.amount`, amount);
  }, [amount, index, setValue]);

  function removeRow() {
    remove(index);
    calculateTVL(price, 0);
  }

  function formatValue(val: string) {
    const elemValue = val.substring(1, val.length);
    return elemValue.replaceAll(",", "");
  }

  return (
    <Box mb={5} key={user.address} display="flex" gap="16px">
      <Box display="flex" flex="0.4">
        <img
          width="40px"
          height="40px"
          src={placeholder}
          alt="placeholder_img"
        />
        <Box ml={2}>
          <Typography variant="body1">{formattedAddress}</Typography>
          <Typography color="text.secondary" variant="body2Small">
            {user.name}
          </Typography>
        </Box>
      </Box>
      <Box flex="0.3">
        <TextField
          size="small"
          variant="outlined"
          placeholder="0x000...000"
          fullWidth
          {...register(`participants.${index}.token`)}
        />
        {errors.participants && (
          <Typography variant="navSub" color="red">
            {errors.participants[index]?.token?.message}
          </Typography>
        )}
      </Box>
      <Box flex="0.3">
        <Controller
          control={control}
          name={`participants.${index}.price`}
          render={({ field: { onChange, onBlur } }) => (
            <TextField
              size="small"
              variant="outlined"
              inputProps={{
                step: "any",
              }}
              placeholder="$0"
              onChange={(e: CustomEvent) => {
                const value = formatValue(e.target.value);
                const customE = { ...e, target: { ...e.target, value } };
                onChange(customE);
                setPrice(parseFloat(value));
              }}
              onBlur={onBlur}
              fullWidth
              InputProps={{
                inputComponent: MaskedTextField,
                inputProps: {
                  maxLength: 16,
                  options: {
                    numeral: true,
                    numeralDecimalScale: 2,
                    prefix: "$",
                    numeralPositiveOnly: true,
                    numeralThousandsGroupStyle: "thousand",
                    value,
                  },
                },
              }}
            />
          )}
        />

        {errors.participants && (
          <Typography variant="navSub" color="red">
            {errors.participants[index]?.price?.message}
          </Typography>
        )}
      </Box>
      <Box flex="0.3">
        <TextField
          size="small"
          variant="outlined"
          type="number"
          inputProps={{
            step: "any",
          }}
          placeholder="0"
          // disabled
          fullWidth
          {...register(`participants.${index}.amount`)}
        />
        {errors.participants && (
          <Typography variant="navSub" color="red">
            {errors.participants[index]?.amount?.message}
          </Typography>
        )}
      </Box>
      <Box flex="0.3" display="flex" flexDirection="column">
        <Controller
          control={control}
          name={`participants.${index}.value`}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              size="small"
              variant="outlined"
              inputProps={{
                step: "any",
              }}
              placeholder="$0"
              onChange={(e: CustomEvent) => {
                const formated = formatValue(e.target.value);
                const customE = { ...e, target: { ...e.target, value: formated } };
                onChange(customE);
                calculateTVL(
                  parseFloat(value) || 0,
                  parseFloat(formated) || 0
                );
                setTokenValue(parseFloat(formated));
              }}
              onBlur={onBlur}
              InputProps={{
                inputComponent: MaskedTextField,
                inputProps: {
                  maxLength: 16,
                  options: {
                    numeral: true,
                    numeralDecimalScale: 2,
                    prefix: "$",
                    numeralPositiveOnly: true,
                    numeralThousandsGroupStyle: "thousand",
                    value,
                  },
                },
              }}
              fullWidth
            />
          )}
        />
        {errors.participants && (
          <Typography variant="navSub" color="red">
            {errors.participants[index]?.value?.message}
          </Typography>
        )}
        <Typography
          mt={0.5}
          textAlign="right"
          variant="labsSmall"
          color="text.secondary"
        >
          Allocation: {formatPct(allocation)}
        </Typography>
      </Box>
      <img
        css={cursor}
        onClick={removeRow}
        src={close}
        alt="close"
        height="32px"
        width="32px"
      />
    </Box>
  );
}
