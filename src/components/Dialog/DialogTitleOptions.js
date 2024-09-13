import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';

function DialogTitleOptions(props) {
  const { handleClose, children } = props;

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <Box style={{ position: 'absolute', top: 8, right: 8 }}>
      {children?.length > 0 && (
        <>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id='settings-menu'
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
            MenuListProps={{ disablePadding: true }}
          >
            {children}
          </Menu>
        </>
      )}

      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
}

DialogTitleOptions.propTypes = {
  handleClose: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default DialogTitleOptions;
