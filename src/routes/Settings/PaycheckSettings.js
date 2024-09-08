import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';

import { _numberToCurrency } from '../../helpers/currency';
import TextFieldListItem from '../../components/List/TextFieldListItem';
import DepositToSelect from '../../components/Selector/DepositToSelect';
import PaycheckTemplateSelect from '../../components/Selector/PaycheckTemplateSelect';
import {
  deletePaycheck,
  postPaycheck,
  putPaycheck,
} from '../../store/paychecks';

const formDataDefault = {
  paycheck_id: '',
  deposit_to_id: '',
  employer: '',
  take_home: '',
  taxes: '',
  retirement: '',
  benefits: '',
  other: '',
  _type: 'paycheck',
};

export default function PaycheckSettings(props) {
  const dispatch = useDispatch();
  const paycheckTemplates = useSelector((state) => {
    return state.paychecks.data.filter((paycheck) => {
      return paycheck?.paycheck_id.startsWith('paycheck:template');
    });
  });

  const [template, setTemplate] = useState({});
  const isNewTemplate = !paycheckTemplates.find(
    (paycheck) => paycheck.paycheck_id === template?.paycheck_id
  );

  const handleChange = (e) => {
    setTemplate((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleChangeNumber = (e) => {
    if (
      e.target.value === '' ||
      (!isNaN(e.target.value) && !isNaN(parseFloat(e.target.value)))
    ) {
      setTemplate((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const handleCreateClick = () => {
    let _template = formDataDefault;
    _template.paycheck_id = `paycheck:template-${paycheckTemplates.length}`;
    setTemplate(_template);
  };

  const handleSelect = (event) => {
    const _template = paycheckTemplates.find(
      (paycheck) => paycheck.paycheck_id === event.target.value
    );
    setTemplate(_template);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const attrs = ['take_home', 'taxes', 'retirement', 'benefits', 'other'];
    attrs.forEach((attr) => {
      if (template[attr] === '') {
        template[attr] = 0;
      }
    });

    if (isNewTemplate) {
      dispatch(postPaycheck(template));
    } else {
      dispatch(putPaycheck(template));
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deletePaycheck(template.paycheck_id));
    setTemplate({});
  };

  return (
    <Box sx={{ mx: 1, mt: 1 }}>
      <Stack direction='row' spacing={1} alignItems='center'>
        <IconButton sx={{ width: 50, height: 50 }} onClick={handleCreateClick}>
          <AddCircleOutlineIcon fontSize='large' />
        </IconButton>
        <Card raised sx={{ width: '100%', p: 1 }}>
          <PaycheckTemplateSelect
            selected={template}
            handleSelect={handleSelect}
          />
        </Card>
      </Stack>
      {template?.paycheck_id && (
        <Card raised sx={{ mt: 1 }}>
          <form>
            <List sx={{ px: 1 }}>
              <ListItem disableGutters>
                <DepositToSelect
                  resource={template}
                  setResource={setTemplate}
                />
              </ListItem>
              <TextFieldListItem
                id='employer'
                label='employer'
                value={template.employer}
                onChange={handleChange}
              />
              <TextFieldListItem
                id='gross'
                label='gross'
                placeholder='0.00'
                value={_numberToCurrency.format(
                  Number(template.take_home) +
                    Number(template.taxes) +
                    Number(template.retirement) +
                    Number(template.benefits) +
                    Number(template.other)
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
                value={template.take_home}
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
                value={template.taxes}
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
                value={template.retirement}
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
                value={template.benefits}
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
                value={template.other}
                onChange={handleChangeNumber}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <ListItem
                sx={{
                  display: 'flex',
                  justifyContent: !isNewTemplate ? 'space-between' : 'center',
                }}
              >
                {!isNewTemplate && (
                  <Button
                    fullWidth
                    type='submit'
                    id='submit'
                    variant='outlined'
                    color='error'
                    onClick={handleDelete}
                    sx={{ maxWidth: 150, mr: 1 }}
                  >
                    delete
                  </Button>
                )}

                <Button
                  fullWidth
                  type='submit'
                  id='submit'
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                  sx={{ maxWidth: 150 }}
                >
                  {isNewTemplate ? 'create' : 'update'}
                </Button>
              </ListItem>
            </List>
          </form>
        </Card>
      )}
    </Box>
  );
}
