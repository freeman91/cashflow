import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

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
    <>
      <Grid item xs={12} mx={1} gap={1} display='flex' justifyContent='center'>
        <Button
          variant='contained'
          endIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          create
        </Button>
        {template?.paycheck_id && (
          <Button
            variant='outlined'
            endIcon={<SaveIcon />}
            color='primary'
            onClick={handleSubmit}
          >
            save
          </Button>
        )}
        {template?.paycheck_id && !isNewTemplate && (
          <Button
            variant='outlined'
            endIcon={<DeleteIcon />}
            color='error'
            onClick={handleDelete}
          >
            delete
          </Button>
        )}
      </Grid>
      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Card sx={{ p: 1, width: '100%' }}>
          <PaycheckTemplateSelect
            selected={template}
            handleSelect={handleSelect}
          />
        </Card>
      </Grid>
      {template?.paycheck_id && (
        <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
          <Card sx={{ width: '100%' }}>
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
              </List>
            </form>
          </Card>
        </Grid>
      )}
    </>
  );
}
