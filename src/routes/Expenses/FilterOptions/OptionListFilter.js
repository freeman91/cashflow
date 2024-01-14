import React, { useEffect, useState } from 'react';
import find from 'lodash/find';
import lowerCase from 'lodash/lowerCase';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

export default function OptionListFilter(props) {
  const { filter, setFilter, optionType } = props;
  const optionListData = useSelector((state) => state.optionLists.data);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (optionType) {
      let listData = find(optionListData, { option_type: optionType });
      setOptions(listData.options);
    } else {
      setOptions([]);
    }
  }, [optionListData, optionType]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant='body1' sx={{ width: '50%' }} align='left'>
        {lowerCase(optionType)}
      </Typography>
      <Select
        variant='standard'
        sx={{ width: '50%' }}
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
        }}
      >
        <MenuItem key='none' value='none'>
          <ListItemText primary='none' />
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
