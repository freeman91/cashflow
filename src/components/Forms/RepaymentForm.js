import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import TextFieldListItem from '../List/TextFieldListItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { postRepayment, putRepayment } from '../../store/repayments';
import { closeItemView } from '../../store/itemView';
import { _numberToCurrency } from '../../helpers/currency';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import LiabilitySelect from '../Selector/LiabilitySelect';
import PaymentFromSelect from '../Selector/PaymentFromSelect';
import SelectOption from '../Selector/SelectOption';
import AutocompleteListItem from '../List/AutocompleteListItem';

const defaultRepayment = {
  repayment_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  principal: '',
  interest: '',
  escrow: '',
  merchant: '',
  category: '',
  subcategory: '',
  _type: 'repayment',
  pending: false,
  account_id: '',
  recurring_id: '',
};

function RepaymentForm(props) {
  const { mode, attrs } = props;
  const dispatch = useDispatch();

  const repayments = useSelector((state) => state.repayments.data);
  const merchants = useSelector((state) => {
    const expenseMerchants = find(state.optionLists.data, {
      option_type: 'merchant',
    });
    return expenseMerchants?.options;
  });
  const categories = useSelector((state) => {
    const categories = find(state.categories.data, {
      category_type: 'expense',
    });
    return categories?.categories;
  });

  const [subcategories, setSubcategories] = useState([]);

  const [repayment, setRepayment] = useState(defaultRepayment);

  useEffect(() => {
    const _subcategories = find(categories, {
      name: repayment?.category,
    });
    setSubcategories(_subcategories?.subcategories || []);
  }, [categories, repayment?.category]);

  useEffect(() => {
    if (attrs.repayment_id) {
      let _repayment = find(repayments, { repayment_id: attrs.repayment_id });
      setRepayment({
        ..._repayment,
        date: dayjs(_repayment.date),
      });
    } else {
      setRepayment((e) => ({ ...e, ...attrs }));
    }
    return () => {
      setRepayment(defaultRepayment);
    };
  }, [attrs, repayments]);

  const handleChange = (id, value) => {
    setRepayment((prev) => ({ ...prev, [id]: value }));
  };

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      dispatch(postRepayment(repayment));
    } else dispatch(putRepayment(repayment));
    handleClose();
  };

  const total = (() => {
    let _total = 0;

    if (!Number(repayment.principal).isNaN) {
      _total += Number(repayment.principal);
    }

    if (!Number(repayment.interest).isNaN) {
      _total += Number(repayment.interest);
    }

    if (repayment.escrow && !Number(repayment.escrow).isNaN) {
      _total += Number(repayment.escrow);
    }

    return _total;
  })();

  return (
    <>
      <ListItem disableGutters>
        <LiabilitySelect
          mode={mode}
          accountId={repayment?.account_id}
          setAccountId={(value) => handleChange('account_id', value)}
        />
      </ListItem>
      <ListItem disableGutters>
        <PaymentFromSelect
          accountId={repayment.payment_from_id}
          onChange={(value) => handleChange('payment_from_id', value)}
        />
      </ListItem>
      <ListItem disableGutters>
        <DatePicker
          label='date'
          value={repayment?.date}
          onChange={(value) =>
            handleChange('date', value.hour(12).minute(0).second(0))
          }
          slotProps={{
            textField: {
              variant: 'standard',
              fullWidth: true,
            },
          }}
        />
      </ListItem>
      <TextFieldListItem
        id='amount'
        label='amount'
        value={_numberToCurrency.format(total)}
        inputProps={{ inputMode: 'decimal' }}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position='start'>
              <AttachMoneyIcon />
            </InputAdornment>
          ),
        }}
      />
      <DecimalFieldListItem
        id='principal'
        value={repayment.principal}
        onChange={(value) => handleChange('principal', value)}
      />
      <DecimalFieldListItem
        id='interest'
        value={repayment.interest}
        onChange={(value) => handleChange('interest', value)}
      />
      {repayment?.subcategory === 'mortgage' && (
        <DecimalFieldListItem
          id='escrow'
          value={repayment.escrow}
          onChange={(value) => handleChange('escrow', value)}
        />
      )}
      <AutocompleteListItem
        id='merchant'
        label='merchant'
        value={repayment.merchant}
        options={merchants}
        onChange={(e, value) => {
          handleChange('merchant', value || '');
        }}
      />
      <SelectOption
        id='category'
        label='category'
        value={repayment.category}
        options={categories?.map((category) => category.name)}
        onChange={(value) => handleChange('category', value)}
      />
      <SelectOption
        id='subcategory'
        label='subcategory'
        value={repayment.subcategory}
        options={subcategories}
        onChange={(value) => handleChange('subcategory', value)}
      />
      <ListItem key='pending' disablePadding disableGutters>
        <ListItemButton
          role={undefined}
          onClick={() => handleChange('pending', !repayment.pending)}
          dense
        >
          <ListItemIcon>
            <Checkbox edge='start' checked={!repayment.pending} tabIndex={-1} />
          </ListItemIcon>
          <ListItemText primary={repayment.pending ? 'pending' : 'processed'} />
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
    </>
  );
}

export default RepaymentForm;
