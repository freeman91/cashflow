import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
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
} from '@material-ui/core';

import { sleep } from '../../helpers/util';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import HourForm from './HourForm';

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

export default function RecordGenerationDialog({ open, handleClose }) {
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
          case 'income':
            return <IncomeForm handleDialogClose={handleDialogClose} />;
          case 'hour':
            return <HourForm handleDialogClose={handleDialogClose} />;
          default:
            return <ExpenseForm handleDialogClose={handleDialogClose} />;
        }
      default:
        return (
          <>
            <Stack className={classes.stack} direction='row' spacing={1}>
              <Button
                onClick={() => selectRecordType('expense')}
                variant='outlined'
                color='info'
                size='large'
                className={classes.button}
              >
                Expense
              </Button>
              <Button
                onClick={() => selectRecordType('income')}
                variant='outlined'
                color='info'
                size='large'
                className={classes.button}
              >
                Income
              </Button>
              <Button
                onClick={() => selectRecordType('hour')}
                variant='outlined'
                color='info'
                size='large'
                className={classes.button}
              >
                Hour
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
