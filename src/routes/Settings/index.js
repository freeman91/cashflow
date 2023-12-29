import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import TextFieldListItem from '../../components/List/TextFieldListItem';
import { postOptionList, putOptionList } from '../../store/optionLists';

const OPTIONS = [
  'expense_vendor',
  'expense_category',
  'income_source',
  'income_category',
  'asset_category',
  'debt_category',
];

function SettingsStack({ children }) {
  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='center'
      spacing={1}
      padding={2}
      sx={{ maxWidth: '550px', flexGrow: 1 }}
    >
      {children}
    </Stack>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const [selectedList, setSelectedList] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(99);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (selectedList === '') {
      setOptions([]);
    } else {
      const optionList = find(optionLists, { option_type: selectedList });
      setOptions(get(optionList, 'options', []));
    }
  }, [selectedList, optionLists]);

  useEffect(() => {
    const _option = get(options, selectedOptionIdx, '');
    setSelectedOption(_option);
  }, [options, selectedOptionIdx]);

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const addOption = () => {
    if (!options.includes('')) {
      setOptions(['', ...options]);
    }
    setSelectedOptionIdx(0);
    setSelectedOption('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    let _options = [...options];
    _options[selectedOptionIdx] = selectedOption;
    _options.sort();

    const optionList = cloneDeep(
      find(optionLists, { option_type: selectedList })
    );

    if (!optionList) {
      dispatch(
        postOptionList({ option_type: selectedList, options: _options })
      );
      setSelectedOptionIdx(99);
      return;
    } else {
      optionList.options = _options;
      dispatch(putOptionList(optionList));
    }

    setSelectedOptionIdx(99);
  };

  return (
    <>
      {selectedList ? (
        <SettingsStack>
          <Card
            raised
            sx={{
              width: '100%',
            }}
          >
            <CardHeader
              disableTypography
              sx={{ p: 1 }}
              title={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setSelectedList('');
                      setSelectedOptionIdx(99);
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant='h5'>
                    {selectedList.replace('_', ' ')}
                  </Typography>
                  <IconButton onClick={addOption}>
                    <AddIcon />
                  </IconButton>
                </div>
              }
            />
          </Card>
          <List sx={{ width: 200 }}>
            {options.map((option, idx) => {
              if (selectedOptionIdx === idx) {
                return (
                  <form key={option} onSubmit={handleSave}>
                    <TextFieldListItem
                      placeholder='option'
                      key={option}
                      id={option}
                      value={selectedOption}
                      onChange={(e) => handleChange(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={handleSave}
                              disabled={selectedOption === option}
                            >
                              <SaveIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </form>
                );
              }

              return (
                <ListItem key={option} dense>
                  <ListItemButton
                    onClick={() => setSelectedOptionIdx(idx)}
                    sx={{ justifyContent: 'center' }}
                  >
                    {option}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </SettingsStack>
      ) : (
        <SettingsStack>
          {OPTIONS.map((option) => (
            <Card key={option} raised sx={{ width: '100%' }}>
              <CardHeader
                disableTypography
                sx={{ p: 1 }}
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='h5'>
                      {option.replace('_', ' ')}
                    </Typography>
                    <IconButton onClick={() => setSelectedList(option)}>
                      <EditIcon />
                    </IconButton>
                  </div>
                }
              />
            </Card>
          ))}
        </SettingsStack>
      )}
    </>
  );
}
