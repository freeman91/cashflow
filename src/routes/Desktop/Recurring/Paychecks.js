import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import {
  deletePaycheck,
  postPaycheck,
  putPaycheck,
} from '../../../store/paychecks';
import { numberToCurrency } from '../../../helpers/currency';
import DecimalFieldListItem from '../../../components/List/DecimalFieldListItem';
import DepositToSelect from '../../../components/Selector/DepositToSelect';
import AutocompleteListItem from '../../../components/List/AutocompleteListItem';
import TextFieldListItem from '../../../components/List/TextFieldListItem';
import ContributionListItems from '../../../components/List/ContributionListItems';

export default function Paychecks() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const paycheckTemplates = useSelector((state) => {
    return state.paychecks.data.filter((paycheck) =>
      paycheck.paycheck_id.startsWith('paycheck:template')
    );
  });

  const incomeSources = find(optionLists, { option_type: 'income_source' });
  const [selectedPaycheck, setSelectedPaycheck] = useState(null);

  const handleClick = (template) => {
    setSelectedPaycheck(template);
  };

  const handleChange = (e) => {
    setSelectedPaycheck((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleCreateClick = () => {
    let _template = {
      paycheck_id: '',
      deposit_to_id: '',
      employer: '',
      _type: 'paycheck',
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
    _template.paycheck_id = `paycheck:template-${paycheckTemplates.length}`;
    setSelectedPaycheck(_template);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const template = cloneDeep(selectedPaycheck);
    const isNewTemplate = !paycheckTemplates.find(
      (paycheck) => paycheck.paycheck_id === selectedPaycheck?.paycheck_id
    );
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
    dispatch(deletePaycheck(selectedPaycheck.paycheck_id));
    setSelectedPaycheck(null);
  };

  return (
    <>
      <Grid item xs={12}>
        <List
          disablePadding
          sx={{
            width: '100%',
            backgroundColor: 'surface.250',
            borderRadius: 1,
            boxShadow: (theme) => theme.shadows[4],
            overflow: 'hidden',
          }}
        >
          <ListItem sx={{ backgroundColor: 'surface.300', pl: 2 }}>
            <ListItemText
              primary='Paychecks'
              primaryTypographyProps={{
                fontWeight: 'bold',
                fontSize: 18,
              }}
            />
            {selectedPaycheck === null && (
              <Button variant='contained' onClick={handleCreateClick}>
                Add Recurring Paycheck
              </Button>
            )}
          </ListItem>
          {sortBy(paycheckTemplates, 'take_home')
            .reverse()
            .map((paycheckTemplate, idx) => {
              if (
                selectedPaycheck !== null &&
                selectedPaycheck?.paycheck_id !== paycheckTemplate.paycheck_id
              )
                return null;
              return (
                <ListItem key={idx}>
                  <Box
                    onClick={() => {
                      if (selectedPaycheck === null) {
                        handleClick(paycheckTemplate);
                      } else {
                        setSelectedPaycheck(null);
                      }
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      p: 1,
                      mr: 1,
                      '&:hover': {
                        backgroundColor: 'surface.400',
                      },
                    }}
                  >
                    {selectedPaycheck?.paycheck_id ===
                    paycheckTemplate.paycheck_id ? (
                      <CloseIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </Box>
                  <ListItemText primary={paycheckTemplate.employer} />
                  {selectedPaycheck?.paycheck_id ===
                  paycheckTemplate.paycheck_id ? (
                    <Button
                      variant='contained'
                      startIcon={<SaveIcon />}
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                  ) : (
                    <ListItemText
                      primary={numberToCurrency.format(
                        paycheckTemplate.take_home
                      )}
                      primaryTypographyProps={{ align: 'right' }}
                    />
                  )}
                  {selectedPaycheck?.paycheck_id ===
                    paycheckTemplate.paycheck_id && (
                    <Button
                      variant='outlined'
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                      color='error'
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  )}
                </ListItem>
              );
            })}
        </List>
      </Grid>
      {selectedPaycheck && (
        <Grid item xs={12} display='flex' justifyContent='center'>
          <List
            sx={{
              width: '100%',
              backgroundColor: 'surface.250',
              borderRadius: 1,
              px: 1,
              boxShadow: (theme) => theme.shadows[4],
              overflow: 'hidden',
            }}
          >
            <ListItem sx={{ gap: 2 }}>
              <AutocompleteListItem
                id='employer'
                label='employer'
                value={selectedPaycheck.employer}
                options={get(incomeSources, 'options', [])}
                onChange={handleChange}
              />
              <DepositToSelect
                resource={selectedPaycheck}
                setResource={setSelectedPaycheck}
              />
            </ListItem>
            <ListItem sx={{ gap: 2 }}>
              <DecimalFieldListItem
                id='take_home'
                item={selectedPaycheck}
                setItem={setSelectedPaycheck}
              />
              <DecimalFieldListItem
                id='taxes'
                item={selectedPaycheck}
                setItem={setSelectedPaycheck}
              />
            </ListItem>
            <ListItem sx={{ gap: 2 }}>
              <ContributionListItems
                paycheck={selectedPaycheck}
                setPaycheck={setSelectedPaycheck}
                attr='retirement_contribution'
              />
              <ContributionListItems
                paycheck={selectedPaycheck}
                setPaycheck={setSelectedPaycheck}
                attr='benefits_contribution'
              />
            </ListItem>
            <ListItem sx={{ gap: 2 }}>
              <DecimalFieldListItem
                id='other_benefits'
                item={selectedPaycheck}
                setItem={setSelectedPaycheck}
              />
              <DecimalFieldListItem
                id='other'
                item={selectedPaycheck}
                setItem={setSelectedPaycheck}
              />
            </ListItem>
            <ListItem>
              <TextFieldListItem
                id='description'
                label='description'
                value={selectedPaycheck.description || ''}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </ListItem>
          </List>
        </Grid>
      )}
    </>
  );
}
