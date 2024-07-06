import React, { useState } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const OPTIONS = ['', 'asc', 'desc'];

function SortMenuButton(props) {
  const { selected, setSelected } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (option) => {
    setSelected(option);
  };

  const open = Boolean(anchorEl);
  const styles = { height: 50, width: 50 };
  return (
    <Box>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        {selected === '' && <HorizontalRuleIcon sx={styles} />}
        {selected === 'asc' && <ExpandLessIcon sx={styles} />}
        {selected === 'desc' && <ExpandMoreIcon sx={styles} />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id='options-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{ sx: { p: 0, minWidth: 50 } }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        {OPTIONS.map((option) => {
          if (option === selected) return null;
          return (
            <MenuItem
              key={option}
              onClick={() => handleItemClick(option)}
              sx={{
                my: 1,
                p: '12px',
                borderRadius: 1,
              }}
            >
              <Typography
                variant='h5'
                align='center'
                sx={{ width: '100%' }}
                fontWeight='bold'
              >
                {option || 'none'}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}

export default SortMenuButton;
