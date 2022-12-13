import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { css } from "@emotion/react";
import { useFieldArray, useForm } from "react-hook-form";
import add from "../../assets/add.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./collectiveAddUsers.schema";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../store/scCreator.reducer";
import { selectCollectiveUsers } from "../../store/scCreator.selectors";

type FormValues = {
  users: { address: string; name: string }[];
  
};

export function CollectiveAddUsers({
  setStep,
  standAlone,
  onClose,
}: {
  setStep: (val: string) => void;
  standAlone?: boolean;
  onClose?: (arr: { address: string, name: string}[]) => void
}): React.ReactElement {
  const dispatch = useDispatch();
  const users = useSelector(selectCollectiveUsers)



  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      users: [{ address: "", name: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "users",
  });

  function onSubmit(data: FormValues) {
    dispatch(setUsers(standAlone ? [...users, ...data.users] : data.users));
    if(standAlone && onClose) {
      onClose(data.users)
    } else {
      setStep("fourth");

    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      css={css`
        height: ${standAlone ? "100%" : "95%"};
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
            Add participants
          </Typography>
          <Typography variant="body2Small" color="text.secondary">
            Add the wallet addresses you want to be part of the collective. You
            can add or remove wallets later.
          </Typography>
          {/* <Box display="flex" p={2} mt={6} mb={1.5} alignItems="center">
            <img src={placeholder} alt="op" />
            <Box ml={2}>
              <Typography variant="body1">0xji3...h51</Typography>
              <Typography sx={{ opacity: 0.6 }} variant="body2Small">
                Haywired
              </Typography>
            </Box>
          </Box> */}
          <Box mt={4}>
            {fields.map((field, index) => (
              <Box mb={2} display="flex" key={`add-user-${index}`} gap="16px">
                <Box>
                  <TextField
                    key={`address-${index}`}
                    variant="outlined"
                    error={!!(errors?.users && errors.users[index]?.address)}
                    fullWidth
                    {...register(`users.${index}.address`, {
                      required: true,
                    })}
                    label="Wallet address"
                  />
                  {errors.users && (
                    <Typography variant="navSub" color="red">
                      {errors.users[index]?.address?.message}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <TextField
                    key={`address-${index}`}
                    variant="outlined"
                    error={!!(errors?.users && errors.users[index]?.name)}
                    fullWidth
                    {...register(`users.${index}.name`, {
                      required: true,
                    })}
                    label="Name"
                  />
                  {errors.users && (
                    <Typography variant="navSub" color="red">
                      {errors.users[index]?.name?.message}
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
            onClick={() => append({ address: "", name: "" })}
          >
            <img src={add} alt="add" />
            <Typography ml={2} variant="body1">
              Add more participants
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
            {standAlone ? "Add" : "Create collective"}
          </Button>
        </Box>
      </Box>
    </form>
  );
}
