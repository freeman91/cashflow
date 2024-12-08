import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import useTheme from '@mui/material/styles/useTheme';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
// import TextFieldListItem from '../../components/List/TextFieldListItem';
import { putOptionList } from '../../store/optionLists';

const TextFieldListItem = (props) => {
  return (
    <ListItem>
      <TextField fullWidth variant='standard' {...props} />
    </ListItem>
  );
};

export default function OptionsList(props) {
  const { optionType, placeholder } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const stateOptions = useSelector((state) => {
    return find(state.optionLists.data, { option_type: optionType });
  });
  const [searchText, setSearchText] = useState('');
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

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ClickAwayListener
      onClickAway={() => {
        let _options = get(stateOptions, 'options', []);
        setSelectedIdx(null);
        setSelectedOption('');
        setOptions(_options);
      }}
    >
      <Box
        sx={{
          border: `1px solid ${theme.palette.surface[300]}`,
          mt: 1,
          borderRadius: '5px',
        }}
      >
        <List disablePadding>
          <ListItem>
            <TextField
              fullWidth
              variant='standard'
              placeholder='search'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position='start' sx={{ mr: 4 }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setSearchText('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
          <ListItemButton onClick={handleCreateClick}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary='create' />
          </ListItemButton>
          <Divider />
          {filteredOptions.map((option) => {
            const idx = findIndex(options, (o) => o === option);
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
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </ClickAwayListener>
  );
}
