import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';

function DialogTitleOptions(props) {
  const { mode, handleClose, children } = props;

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <div style={{ position: 'absolute', top: 8, right: 8 }}>
      {mode === 'edit' && children ? (
        <>
          <IconButton
            onClick={handleMenuClick}
            sx={{
              width: 33,
              height: 33,
            }}
          >
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
      ) : null}

      <IconButton
        onClick={handleClose}
        sx={{
          color: (theme) => theme.palette.grey[30],
          width: 33,
          height: 33,
        }}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}

DialogTitleOptions.propTypes = {
  mode: PropTypes.string,
  handleClose: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default DialogTitleOptions;
