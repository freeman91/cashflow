import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import UndoIcon from '@mui/icons-material/Undo';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';

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
    <>
      <Grid item xs={12} mx={1} display='flex' gap={1} justifyContent='center'>
        <Button
          variant='contained'
          endIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          create
        </Button>
        <Button
          variant='outlined'
          endIcon={<UndoIcon />}
          color='info'
          onClick={() => {
            setSelectedIdx(null);
            setSelectedOption('');
            setOptions(get(stateOptions, 'options', []));
          }}
        >
          reset
        </Button>
      </Grid>

      <Grid item xs={12} mx={1}>
        <Paper
          component='form'
          sx={{
            p: '0px 2px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <IconButton sx={{ px: '10px' }} color='info'>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder='search'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IconButton onClick={() => setSearchText('')} color='info'>
            <ClearIcon />
          </IconButton>
        </Paper>
      </Grid>

      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Card sx={{ width: '100%' }}>
          <List disablePadding>
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
        </Card>
      </Grid>
    </>
  );
}
