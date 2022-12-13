import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { css } from "@emotion/react";
import { useFieldArray, useForm } from "react-hook-form";
import add from "../../assets/add.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./collectiveAddTokens.schema";
import { useDispatch } from "react-redux";
import { setTokens } from "../../store/scCreator.reducer";

type FormValues = {
  tokens: { token: string; price?: number }[];
};

export function CollectiveAddTokens({
  setStep,
}: {
  setStep: (val: string) => void;
}): React.ReactElement {
  const dispatch = useDispatch();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      tokens: [{ token: "", price: undefined }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "tokens",
  });

  function onSubmit(data: FormValues) {
    dispatch(setTokens(data.tokens));
    setStep("third");
  }

  function onSkip() {
    setStep("third");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      css={css`
        height: 100%;
      `}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <Box>
          <Typography variant="h2" mb={0.5} fontWeight="400">
            Add tokens
          </Typography>
          <Typography variant="body2Small" color="text.secondary">
            Add the tokens that will be used in this collective and their
            prices.
          </Typography>
          <Box mt={4}>
            {fields.map((field, index) => (
              <Box key={`add-tokens-${index}`} display="flex" mb={2} gap="16px">
                <Box>
                  <TextField
                    key={`token-${index}`}
                    variant="outlined"
                    size="small"
                    error={!!(errors?.tokens && errors.tokens[index]?.token)}
                    fullWidth
                    {...register(`tokens.${index}.token`, {
                      required: true,
                    })}
                    label="Token address"
                  />
                  {errors.tokens && (
                    <Typography variant="navSub" color="red">
                      {errors.tokens[index]?.token?.message}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <TextField
                    key={`token-${index}`}
                    variant="outlined"
                    type="number"
                    size="small"
                    error={!!(errors?.tokens && errors.tokens[index]?.price)}
                    fullWidth
                    {...register(`tokens.${index}.price`, {
                      required: true,
                    })}
                    label="Token price"
                  />
                  {errors.tokens && (
                    <Typography variant="navSub" color="red">
                      {errors.tokens[index]?.price?.message}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            p={2}
            mt={1.5}
            display="flex"
            sx={{ cursor: "pointer" }}
            alignItems="center"
            onClick={() => append({ token: "", price: undefined })}
          >
            <img src={add} alt="add" />
            <Typography ml={2} variant="body1">
              Add more tokens
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            type="submit"
            sx={{ textTransform: "none", height: "42px" }}
            fullWidth
          >
            Next
          </Button>
          <Button
            variant="outlined"
            type="submit"
            color="primary"
            sx={{ textTransform: "none", height: "42px", border: "none" }}
            fullWidth
            onClick={onSkip}
          >
            Skip
          </Button>
        </Box>
      </Box>
    </form>
  );
}
