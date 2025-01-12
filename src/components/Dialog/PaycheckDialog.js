import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  deletePaycheck,
  postPaycheck,
  putPaycheck,
} from '../../store/paychecks';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
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

function PaycheckDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const paychecks = useSelector((state) => state.paychecks.data);
  const templates = useSelector((state) => {
    return state.recurrings.data.filter(
      (recurring) => recurring.item_type === 'paycheck'
    );
  });
  const { mode, id, attrs } = useSelector((state) => state.dialogs.paycheck);

  const [paycheck, setPaycheck] = useState(defaultPaycheck);

  const incomeSources = find(optionLists, { option_type: 'income_source' });

  useEffect(() => {
    if (id) {
      let _paycheck = find(paychecks, { paycheck_id: id });
      setPaycheck({
        ..._paycheck,
        date: dayjs(_paycheck.date),
      });
    }
  }, [id, paychecks]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setPaycheck((e) => ({ ...e, ...attrs, date: dayjs(attrs.date) }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setPaycheck({ ...paycheck, [e.target.id]: e.target.value });
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

  const handleClose = () => {
    dispatch(closeDialog('paycheck'));
    setPaycheck(defaultPaycheck);
  };

  const handleTemplateClick = (e, template) => {
    e.preventDefault();
    setPaycheck((prevPaycheck) => ({
      ...prevPaycheck,
      deposit_to_id: template.paycheck_attributes.deposit_to_id,
      employer: template.paycheck_attributes.employer,
      take_home: template.paycheck_attributes.take_home,
      taxes: template.paycheck_attributes.taxes,
      retirement_contribution:
        template.paycheck_attributes.retirement_contribution,
      benefits_contribution: template.paycheck_attributes.benefits_contribution,
      other_benefits: template.paycheck_attributes.other_benefits,
      other: template.paycheck_attributes.other,
      recurring_id: template.recurring_id,
    }));
  };

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
    ...templates.map((template) => {
      if (mode !== 'create') return null;
      return (
        <MenuItem
          key={template.paycheck_id}
          onClick={(e) => handleTemplateClick(e, template)}
        >
          {template.name}
        </MenuItem>
      );
    }),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultPaycheck._type}
      title={`${mode} ${defaultPaycheck._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          <ListItem disableGutters>
            <DepositToSelect resource={paycheck} setResource={setPaycheck} />
          </ListItem>
          <ListItem disableGutters>
            <DatePicker
              label='date'
              value={paycheck.date}
              onChange={(value) => {
                setPaycheck({
                  ...paycheck,
                  date: value.hour(12).minute(0).second(0),
                });
              }}
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
            options={get(incomeSources, 'options', [])}
            onChange={handleChange}
          />
          <DecimalFieldListItem
            id='take_home'
            item={paycheck}
            setItem={setPaycheck}
          />
          <DecimalFieldListItem
            id='taxes'
            item={paycheck}
            setItem={setPaycheck}
          />
          <ContributionListItem
            paycheck={paycheck}
            setPaycheck={setPaycheck}
            attr='retirement_contribution'
          />
          <ContributionListItem
            paycheck={paycheck}
            setPaycheck={setPaycheck}
            attr='benefits_contribution'
          />
          <DecimalFieldListItem
            id='other_benefits'
            item={paycheck}
            setItem={setPaycheck}
          />
          <DecimalFieldListItem
            id='other'
            item={paycheck}
            setItem={setPaycheck}
          />
          <TextFieldListItem
            id='description'
            label='description'
            value={paycheck.description ? paycheck.description : ''}
            onChange={handleChange}
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
              onClick={() =>
                setPaycheck({ ...paycheck, pending: !paycheck.pending })
              }
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={!paycheck.pending}
                  tabIndex={-1}
                />
              </ListItemIcon>
              <ListItemText
                primary={paycheck.pending ? 'pending' : 'processed'}
              />
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
              sx={{ width: '30%' }}
            >
              cancel
            </Button>
            <Button
              type='submit'
              id='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              sx={{ width: '30%' }}
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
