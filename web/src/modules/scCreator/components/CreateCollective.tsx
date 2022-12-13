import { Button, Box, Dialog } from "@mui/material";
import React, { useMemo, useState } from "react";
import { BuildingCollective } from "./BuildingCollective";
import { CollectiveAddName } from "./CollectiveAddName";
import { CollectiveAddUsers } from "./CollectiveAddUsers/CollectiveAddUsers";
import { CollectiveConnect } from "./CollectiveConnect";
import { Stepper } from "./Stepper";

export function CreateCollective(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('first')

  const body = useMemo(() => {
    switch (step) {
      case 'first':
        return <CollectiveConnect setStep={setStep} />;
      case 'second':
        return <CollectiveAddName setStep={setStep} />;
      case 'third':
        return <CollectiveAddUsers setStep={setStep} />
      case 'fourth':
        return <BuildingCollective />
      default:
        return <CollectiveAddName setStep={setStep} />;
    }
  }, [step])

  function onClose() {
    setOpen(false)
    setStep('first')
  }
  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Dialog open={open} onClose={onClose} disableScrollLock>
        <Box
          width="400px"
          height="596px"
          p={3}
        >
          
          { body }
          <Stepper step={step} setStep={setStep} />
        </Box>
      </Dialog>
      <Button
        variant="contained"
        sx={{ textTransform: "none", height: "42px" }}
        onClick={() => setOpen(true)}
      >
        Create collective
      </Button>
    </Box>
  );
}
