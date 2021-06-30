import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import { filter, forEach } from 'lodash';

import { sleep } from '../../helpers/util';

const useStyles = makeStyles((theme) => ({}));

export default function RecordGenerationDialog({ open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [recordType, setRecordType] = useState(null);
  const [steps, setSteps] = useState(['Select Record Type']);

  const { expenses, incomes, hours } = useSelector((state) => state.records);
  const user = useSelector((state) => state.user);

  useEffect(() => {}, []);

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
    }
    setActiveStep(1);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <p>form</p>;
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
            } else if (index === 1) {
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
