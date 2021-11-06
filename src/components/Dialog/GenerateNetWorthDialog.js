import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';

import { sleep } from '../../helpers/util';
import AssetForm from '../Form/AssetForm';
import DebtForm from '../Form/DebtForm';

const useStyles = makeStyles({
  dialog: {
    '& .MuiPaper-root': { width: '40%' },
  },
  stack: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    width: '10rem',
  },
});

export default function GenerateNetWorthDialog({ open, handleClose }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [recordType, setRecordType] = useState(null);
  const [steps, setSteps] = useState(['Select Record Type']);

  const handleDialogClose = async () => {
    handleClose();
    await sleep(500);
    setActiveStep(0);
    setSteps(['Select Record Type']);
  };

  const selectRecordType = (type) => {
    switch (type) {
      case 'income':
        setRecordType(type);
        setSteps([...steps, 'Income Form']);
        break;
      case 'hour':
        setRecordType(type);
        setSteps([...steps, 'Hour Form']);
        break;
      default:
        setRecordType('expense');
        setSteps([...steps, 'Expense Form']);
        break;
    }
    setActiveStep(1);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        switch (recordType) {
          case 'hour':
            return (
              <DebtForm handleDialogClose={handleDialogClose} mode='create' />
            );
          default:
            return (
              <AssetForm handleDialogClose={handleDialogClose} mode='create' />
            );
        }
      default:
        return (
          <>
            <Stack className={classes.stack} direction='row' spacing={1}>
              <Button
                onClick={() => selectRecordType('asset')}
                variant='outlined'
                color='info'
                size='large'
                className={classes.button}
              >
                Asset
              </Button>
              <Button
                onClick={() => selectRecordType('debt')}
                variant='outlined'
                color='info'
                size='large'
                className={classes.button}
              >
                Debt
              </Button>
            </Stack>
          </>
        );
    }
  };

  return (
    <Dialog className={classes.dialog} open={open} onClose={handleDialogClose}>
      <DialogTitle id='record-generation-dialog-title'>
        Generate New Record
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            if (index === 0) {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            } else {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            }
          })}
        </Stepper>
        <Divider sx={{ marginTop: '.5rem', marginBottom: '.5rem' }} />
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
