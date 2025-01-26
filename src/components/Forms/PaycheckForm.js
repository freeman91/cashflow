import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  postPaycheck,
  putPaycheck,
  deletePaycheck,
} from '../../store/paychecks';
import { closeItemView } from '../../store/itemView';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import DepositToSelect from '../Selector/DepositToSelect';
import AutocompleteListItem from '../List/AutocompleteListItem';
import ContributionListItem from '../List/ContributionListItem';

const defaultPaycheck = {
  paycheck_id: '',
  deposit_to_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  employer: '',
  _type: 'paycheck',
  pending: false,
  take_home: '',
  taxes: '',
  retirement_contribution: {
    name: '',
    employer_amount: '',
    employee_amount: '',
    account_id: '',
  },
  benefits_contribution: {
    name: '',
    employer_amount: '',
    employee_amount: '',
    account_id: '',
  },
  other_benefits: '',
  other: '',
  description: '',
};

function PaycheckForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();

  const paychecks = useSelector((state) => state.paychecks.data);
  const [paycheck, setPaycheck] = useState(defaultPaycheck);

  useEffect(() => {
    if (attrs?.paycheck_id) {
      let _paycheck = find(paychecks, { paycheck_id: attrs.paycheck_id });
      setPaycheck({
        ..._paycheck,
        date: dayjs(_paycheck.date),
      });
    } else {
      setPaycheck((prevPaycheck) => ({ ...prevPaycheck, ...attrs }));
    }
    return () => {
      setPaycheck(defaultPaycheck);
    };
  }, [attrs, paychecks]);

  const handleChange = (id, value) => {
    setPaycheck((prevPaycheck) => ({
      ...prevPaycheck,
      [id]: value,
    }));
  };

  const handleClose = () => {
    dispatch(closeItemView());
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
    handleClose();
  };

  return (
    <>
      <ListItem disableGutters>
        <DepositToSelect
          accountId={paycheck.deposit_to_id}
          onChange={(value) => handleChange('deposit_to_id', value)}
        />
      </ListItem>
      <ListItem disableGutters>
        <DatePicker
          label='date'
          value={paycheck.date}
          onChange={(value) => handleChange('date', value)}
          slotProps={{
            textField: {
              variant: 'standard',
              fullWidth: true,
            },
          }}
        />
      </ListItem>
      <AutocompleteListItem
        id='employer'
        label='employer'
        value={paycheck.employer}
        options={[]}
        onChange={(e, value) => handleChange('employer', value || '')}
      />
      <DecimalFieldListItem
        id='take home'
        value={paycheck.take_home}
        onChange={(value) => handleChange('take_home', value)}
      />
      <DecimalFieldListItem
        id='taxes'
        value={paycheck.taxes}
        onChange={(value) => handleChange('taxes', value)}
      />
      <ContributionListItem
        label='Retirement Contribution'
        attributes={paycheck?.retirement_contribution}
        onChange={(id, value) => {
          setPaycheck((prevPaycheck) => ({
            ...prevPaycheck,
            retirement_contribution: {
              ...prevPaycheck.retirement_contribution,
              [id]: value,
            },
          }));
        }}
      />
      <ContributionListItem
        label='Benefits Contribution'
        attributes={paycheck?.benefits_contribution}
        onChange={(id, value) =>
          setPaycheck((prevPaycheck) => ({
            ...prevPaycheck,
            benefits_contribution: {
              ...prevPaycheck.benefits_contribution,
              [id]: value,
            },
          }))
        }
      />
      <DecimalFieldListItem
        id='other benefits'
        value={paycheck.other_benefits}
        onChange={(value) => handleChange('other_benefits', value)}
      />
      <DecimalFieldListItem
        id='other'
        value={paycheck.other}
        onChange={(value) => handleChange('other', value)}
      />
      <ListItem disableGutters>
        <DepositToSelect
          accountId={paycheck.deposit_to_id}
          onChange={(value) => handleChange('deposit_to_id', value)}
        />
      </ListItem>
      <TextFieldListItem
        id='description'
        label='description'
        value={paycheck.description ? paycheck.description : ''}
        onChange={(e) => handleChange('description', e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <DescriptionIcon />
            </InputAdornment>
          ),
        }}
      />
      <ListItem key='pending' disableGutters disablePadding>
        <ListItemButton
          role={undefined}
          onClick={() => handleChange('pending', !paycheck.pending)}
          dense
        >
          <ListItemIcon>
            <Checkbox edge='start' checked={!paycheck.pending} tabIndex={-1} />
          </ListItemIcon>
          <ListItemText primary={paycheck.pending ? 'pending' : 'processed'} />
        </ListItemButton>
      </ListItem>
      <ListItem
        key='buttons'
        disableGutters
        sx={{ justifyContent: 'space-around' }}
      >
        <Button
          onClick={handleClose}
          variant='outlined'
          color='info'
          sx={{ width: '35%' }}
        >
          cancel
        </Button>
        <Button
          type='submit'
          id='submit'
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          sx={{ width: '35%' }}
        >
          submit
        </Button>
        <IconButton onClick={handleDelete}>
          <DeleteIcon color='error' />
        </IconButton>
      </ListItem>
    </>
  );
}

export default PaycheckForm;
