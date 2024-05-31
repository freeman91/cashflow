import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';

import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import TextFieldListItem from '../../components/List/TextFieldListItem';
import { putOptionList } from '../../store/optionLists';

export default function OptionsList(props) {
  const { optionType, placeholder, trigger, toggleTrigger } = props;
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (trigger) {
      if (!options.includes('')) {
        setOptions(['', ...options]);
      }
      setSelectedIdx(0);
      setSelectedOption('');
      toggleTrigger();
    }
  }, [trigger, options, toggleTrigger]);

  useEffect(() => {
    const optionList = find(optionLists, { option_type: optionType });
    let _options = [...get(optionList, 'options', [])];
    setOptions(_options.sort());
    setSelectedIdx(null);
    setSelectedOption('');
  }, [optionLists, optionType]);

  const handleSave = (e) => {
    e.preventDefault();
    let _options = [...options];

    if (!selectedOption) {
      _options.splice(selectedIdx, 1);
    } else {
      _options[selectedIdx] = selectedOption;
      _options.sort();
    }

    let optionList = cloneDeep(find(optionLists, { option_type: optionType }));

    optionList.options = _options;
    dispatch(putOptionList(optionList));
    setSelectedIdx(null);
    setSelectedOption('');
  };

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <List>
      {options.map((option, idx) => {
        if (selectedIdx === idx) {
          return (
            <form key={option} onSubmit={handleSave}>
              <TextFieldListItem
                sx={{ px: 2 }}
                placeholder={placeholder}
                key={option}
                id={option}
                value={selectedOption || ''}
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
              onClick={() => {
                setSelectedIdx(idx);
                setSelectedOption(option);
              }}
              sx={{ justifyContent: 'left' }}
            >
              {option}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
