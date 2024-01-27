import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';

import { putUser } from '../../store/user';
import TextFieldListItem from '../../components/List/TextFieldListItem';
import NewTransactionButton from '../../components/NewTransactionButton';

const formDataDefault = {
  employer: '',
  take_home: '',
  taxes: '',
  retirement: '',
  benefits: '',
  other: '',
};

export default function Paycheck() {
  const theme = useTheme();
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
    <>
      <Card
        raised
        sx={{
          width: '100%',
          maxWidth: theme.breakpoints.maxWidth,
          mt: 2,
        }}
      >
        <CardHeader
          title='paycheck details'
          titleTypographyProps={{ align: 'left' }}
        />
        <CardContent
          sx={{
            pt: 0,
            '&:last-child': {
              pb: 1,
            },
          }}
        >
          <form>
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
              value={
                Math.round(
                  (Number(formData.take_home) +
                    Number(formData.taxes) +
                    Number(formData.retirement) +
                    Number(formData.benefits) +
                    Number(formData.other)) *
                    100
                ) / 100
              }
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
            <Button
              type='submit'
              id='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              sx={{ width: '50%', mt: 1 }}
            >
              save
            </Button>
          </form>
        </CardContent>
      </Card>
      <NewTransactionButton transactionTypes={['income', 'paycheck']} />
    </>
  );
}
