import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';

import TextFieldListItem from '../../components/List/TextFieldListItem';
import { putOptionList } from '../../store/optionLists';

export default function OptionsList(props) {
  const { optionType, placeholder } = props;
  const dispatch = useDispatch();
  const stateOptions = useSelector((state) => {
    return find(state.optionLists.data, { option_type: optionType });
  });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let _options = get(stateOptions, 'options', []);
    setOptions(_options);
    setSelectedIdx(null);
    setSelectedOption('');
  }, [stateOptions, optionType]);

  const handleSave = (e) => {
    e.preventDefault();
    let _options = [...options];

    if (!selectedOption) {
      _options.splice(selectedIdx, 1);
    } else {
      _options[selectedIdx] = selectedOption;
      _options.sort();
    }

    let optionListItem = cloneDeep(stateOptions);
    optionListItem.options = _options;
    dispatch(putOptionList(optionListItem));
    setSelectedIdx(null);
    setSelectedOption('');
  };

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const handleCreateClick = () => {
    setOptions((prevOptions) => ['', ...prevOptions]);
    setSelectedIdx(0);
    setSelectedOption('');
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        let _options = get(stateOptions, 'options', []);
        setSelectedIdx(null);
        setSelectedOption('');
        setOptions(_options);
      }}
    >
      <Card raised sx={{ px: 1 }}>
        <Fab
          color='primary'
          sx={{ position: 'fixed', right: 15, top: 50 }}
          onClick={handleCreateClick}
        >
          <AddIcon />
        </Fab>
        <List disablePadding>
          {options.map((option, idx) => {
            if (selectedIdx === idx) {
              return (
                <form key={option} onSubmit={handleSave}>
                  <TextFieldListItem
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
              <React.Fragment key={option}>
                <ListItemButton
                  onClick={() => {
                    setSelectedIdx(idx);
                    setSelectedOption(option);
                  }}
                  sx={{ justifyContent: 'left' }}
                >
                  {option}
                </ListItemButton>
                {options.length - 1 !== idx && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </Card>
    </ClickAwayListener>
  );
}
