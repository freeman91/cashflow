import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { _numberToCurrency } from '../../helpers/currency';
import { putUser } from '../../store/user';
import TextFieldListItem from '../../components/List/TextFieldListItem';

const formDataDefault = {
  employer: '',
  take_home: '',
  taxes: '',
  retirement: '',
  benefits: '',
  other: '',
};

export default function PaycheckSettings(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.item);
  const [formData, setFormData] = useState(formDataDefault);

  useEffect(() => {
    if (user?.paycheck_defaults) {
      setFormData(user.paycheck_defaults);
    }
  }, [user?.paycheck_defaults]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleChangeNumber = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      putUser({
        ...user,
        paycheck_defaults: {
          employer: formData.employer,
          take_home: Number(formData.take_home),
          taxes: Number(formData.taxes),
          retirement: Number(formData.retirement),
          benefits: Number(formData.benefits),
          other: Number(formData.other),
        },
      })
    );
  };

  return (
    <Card raised>
      <CardContent sx={{ p: 0, pb: '4px !important' }}>
        <form>
          <List sx={{ minWidth: 350, px: 1 }}>
            <TextFieldListItem
              id='employer'
              label='employer'
              value={formData.employer}
              onChange={handleChange}
            />
            <TextFieldListItem
              id='gross'
              label='gross'
              placeholder='0.00'
              value={_numberToCurrency.format(
                Number(formData.take_home) +
                  Number(formData.taxes) +
                  Number(formData.retirement) +
                  Number(formData.benefits) +
                  Number(formData.other)
              )}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextFieldListItem
              id='take_home'
              label='take home'
              placeholder='0.00'
              value={formData.take_home}
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
              value={formData.taxes}
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
              value={formData.retirement}
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
              value={formData.benefits}
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
              value={formData.other}
              onChange={handleChangeNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                fullWidth
                type='submit'
                id='submit'
                variant='contained'
                color='primary'
                onClick={handleSubmit}
                sx={{ maxWidth: 150 }}
              >
                save
              </Button>
            </ListItem>
          </List>
        </form>
      </CardContent>
    </Card>
  );
}
