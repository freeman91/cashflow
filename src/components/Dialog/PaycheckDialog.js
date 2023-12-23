import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  deletePaycheck,
  postPaycheck,
  putPaycheck,
} from '../../store/paychecks';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';

const defaultPaycheck = {
  paycheck_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  amount: '',
  employer: '',
  _type: 'paycheck',
  take_home: '',
  taxes: '',
  retirement: '',
  benefits: '',
  other: '',
  description: '',
};

function PaycheckDialog() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.item);
  const paychecks = useSelector((state) => state.paychecks.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.paycheck);
  const [paycheck, setPaycheck] = useState(defaultPaycheck);

  useEffect(() => {
    if (id) {
      let _paycheck = find(paychecks, { paycheck_id: id });
      setPaycheck(_paycheck);
    }
  }, [id, paychecks]);

  useEffect(() => {
    if (user?.paycheck_defaults) {
      setPaycheck((e) => ({ ...e, ...user?.paycheck_defaults }));
    }
    if (!isEmpty(attrs)) {
      setPaycheck((e) => ({ ...e, ...attrs }));
    }
  }, [attrs, user?.paycheck_defaults]);

  const handleChange = (e) => {
    setPaycheck({ ...paycheck, [e.target.id]: e.target.value });
  };

  const handleChangeNumber = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      setPaycheck({ ...paycheck, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postPaycheck(paycheck));
    } else dispatch(putPaycheck(paycheck));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deletePaycheck(paycheck.paycheck_id));
  };

  const handleClose = () => {
    dispatch(closeDialog('paycheck'));
    setPaycheck(defaultPaycheck);
  };

  return (
    <BaseDialog
      type={defaultPaycheck._type}
      title={`${mode} ${defaultPaycheck._type}`}
      handleClose={handleClose}
      titleOptions={<MenuItem onClick={handleDelete}>delete</MenuItem>}
    >
      <form>
        <List sx={{ width: 375 }}>
          {mode !== 'create' && (
            <TextFieldListItem
              id='paycheck_id'
              label='paycheck_id'
              value={paycheck.paycheck_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )}
          <ListItem sx={{ pl: 0, pr: 0 }}>
            <DatePicker
              label='date'
              value={paycheck.date}
              onChange={(value) => {
                setPaycheck({
                  ...paycheck,
                  date: value.hour(12).minute(0).second(0),
                });
              }}
              renderInput={(params) => {
                return <TextField {...params} fullWidth variant='standard' />;
              }}
            />
          </ListItem>
          <TextFieldListItem
            id='employer'
            label='employer'
            value={paycheck.employer}
            onChange={handleChange}
          />
          <TextFieldListItem
            id='take_home'
            label='take_home'
            placeholder='0.00'
            value={paycheck.take_home}
            onChange={handleChangeNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextFieldListItem
            id='taxes'
            label='taxes'
            placeholder='0.00'
            value={paycheck.taxes}
            onChange={handleChangeNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextFieldListItem
            id='retirement'
            label='retirement'
            placeholder='0.00'
            value={paycheck.retirement}
            onChange={handleChangeNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextFieldListItem
            id='benefits'
            label='benefits'
            placeholder='0.00'
            value={paycheck.benefits}
            onChange={handleChangeNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextFieldListItem
            id='other'
            label='other'
            placeholder='0.00'
            value={paycheck.other}
            onChange={handleChangeNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextFieldListItem
            id='description'
            label='description'
            value={paycheck.description}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
          />
          <ListItem
            key='buttons'
            disablePadding
            sx={{ pt: 1, pl: 0, pr: 0, justifyContent: 'space-between' }}
          >
            <Button
              onClick={handleClose}
              variant='outlined'
              color='info'
              sx={{ width: '45%' }}
            >
              cancel
            </Button>
            <Button
              type='submit'
              id='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              sx={{ width: '45%' }}
            >
              submit
            </Button>
          </ListItem>
        </List>
      </form>
    </BaseDialog>
  );
}

export default PaycheckDialog;
