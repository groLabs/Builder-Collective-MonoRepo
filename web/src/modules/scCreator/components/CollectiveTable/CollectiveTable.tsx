import { Box, Dialog, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCollectiveUsers } from "../../store/scCreator.selectors";
import { CollectiveTableRow } from "./CollectiveTableRow";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./collectiveTable.schema";
import add from "../../assets/add.png";
import { CollectiveAddUsers } from "../CollectiveAddUsers/CollectiveAddUsers";
import BigNumber from "bignumber.js";
import { CollectiveHeader } from "./CollectiveHeader";
import { setParticipants } from "../../store/scCreator.reducer";

export function CollectiveTable(): React.ReactElement {
  const dispatch = useDispatch()

  const [addParticipants, setAddParticipants] = useState(false)
  const users = useSelector(selectCollectiveUsers);
  const [tvl, setTvl] = useState(0)

  function calculateTVL(oldValue: number, currentValue: number) {
    const finalTvl = tvl - oldValue + currentValue
    setTvl(finalTvl)
  }

  const {
    control,
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    setValue
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      participants: users.map((user) => ({
        name: user.name,
        address: user.address,
        token: "",
        price: undefined,
        amount: undefined,
        value: undefined,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  function onSubmit(data: any) {
    dispatch(setParticipants(data.participants))
  }

  function onCloseModal(users: { address: string, name: string}[]) {
    setAddParticipants(false)
    users.forEach((user) =>
      append({
        address: user.address,
        name: user.name,
        token: "",
        amount: undefined,
        price: undefined,
        value: undefined,
      })
    );
    
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CollectiveHeader tvl={new BigNumber(tvl)}  disabled={!isDirty || !isValid} />
        <Box mt={5}>
          <Box display="flex">
            <Box flex="0.37">
              <Typography variant="body2" color="text.secondary">
                Participants
              </Typography>
            </Box>
            <Box flex="0.3">
              <Typography
                textAlign="center"
                variant="body2"
                color="text.secondary"
              >
                Token address
              </Typography>
            </Box>
            <Box flex="0.3">
              <Typography
                textAlign="center"
                variant="body2"
                color="text.secondary"
              >
                Token price
              </Typography>
            </Box>
            <Box flex="0.3">
              <Typography
                textAlign="center"
                variant="body2"
                color="text.secondary"
              >
                Token amount
              </Typography>
            </Box>
            <Box flex="0.3" mr={6}>
              <Typography
                textAlign="center"
                variant="body2"
                color="text.secondary"
              >
                Value locked
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: "#D9D9D9", mt: 2, mb: 4 }} />

          {fields.map((user, index) => (
            <CollectiveTableRow
              register={register}
              key={user.address}
              user={{ name: user.name, address: user.address }}
              tvl={tvl}
              index={index}
              control={control}
              errors={errors}
              setValue={setValue}
              remove={remove}
              calculateTVL={calculateTVL}
            />
          ))}
        </Box>
        <Box
          mt={5}
          display="flex"
          sx={{ cursor: "pointer", maxWidth: '250px' }}
          alignItems="center"
          onClick={() => setAddParticipants(true)}
        >
          <img src={add} alt="add" />
          <Typography ml={2} variant="body1">
            Add more participants
          </Typography>
        </Box>
      </form>
      <Dialog
        open={addParticipants}
        onClose={() => setAddParticipants(false)}
        disableScrollLock
      >
        <Box width="400px" height="596px" p={3}>
          <CollectiveAddUsers
            standAlone
            onClose={onCloseModal}
            setStep={() => {}}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
