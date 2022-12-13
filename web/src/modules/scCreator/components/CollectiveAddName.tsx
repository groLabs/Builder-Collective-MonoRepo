import { Box, Typography, TextField, Button } from "@mui/material";
import React from "react";
import { css } from "@emotion/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setName } from "../store/scCreator.reducer";

type FormValues = {
  name: string;
  description: string;
};

export function CollectiveAddName({
  setStep,
}: {
  setStep: (val: string) => void;
}): React.ReactElement {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: FormValues) {
    dispatch(setName(data.name));
    setStep("third");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      css={css`
        height: 95%;
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
            Create new collective
          </Typography>
          <Typography variant="body2Small" color="text.secondary">
            Lorem ipsum dolor sit amet consectetur. Libero morbi aliquet
            vehicula libero neque tincidunt. Viverra sapien.
          </Typography>
          <TextField
            error={!!errors.name}
            sx={{ mt: 4 }}
            variant="outlined"
            label="Name"
            {...register("name", { required: true })}
            fullWidth
          />
          {errors.name?.type === "required" && (
            <Typography variant="navSub" color="red">
              This field is required
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          type="submit"
          sx={{ textTransform: "none", height: "42px" }}
          fullWidth
        >
          Next
        </Button>
      </Box>
    </form>
  );
}
