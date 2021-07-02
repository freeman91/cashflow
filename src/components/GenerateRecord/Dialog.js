import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Step,
  StepLabel,
  Stepper,
} from '@material-ui/core';

import { sleep } from '../../helpers/util';
import ExpenseForm from './ExpenseForm';

export default function RecordGenerationDialog({ open, handleClose }) {
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
            return <p>income form</p>;
          case 'hour':
            return <p>hour form</p>;
          default:
            return <ExpenseForm />;
        }
      default:
        return (
          <>
            <Button onClick={() => selectRecordType('expense')}>Expense</Button>
            <Button onClick={() => selectRecordType('income')}>Income</Button>
            <Button onClick={() => selectRecordType('hour')}>Hour</Button>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
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
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
