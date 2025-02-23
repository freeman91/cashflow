import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import startCase from 'lodash/startCase';
import get from 'lodash/get';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popper from '@mui/material/Popper';

import { openItemView } from '../../../store/itemView';
import {
  MONTH,
  CATEGORIES,
  MERCHANTS,
  REPAYMENTS,
} from '../../Layout/CustomAppBar/ReportsAppBar';

export default function OptionsButton(props) {
  const { expenses, repayments, selectedTab } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const type = get(location.pathname.split('/'), '2', MONTH);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        sx={{ height: 35, width: 35 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Box>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  id='split-button-menu'
                  autoFocusItem
                  disablePadding
                  sx={{
                    bgcolor: 'surface.300',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: (theme) => theme.shadows[4],
                  }}
                >
                  {[CATEGORIES, MERCHANTS].includes(selectedTab) && (
                    <MenuItem
                      onClick={() =>
                        dispatch(
                          openItemView({
                            itemType: 'transactions',
                            mode: 'view',
                            attrs: {
                              label: 'All Expenses',
                              transactions: expenses,
                            },
                          })
                        )
                      }
                    >
                      View All Expenses
                    </MenuItem>
                  )}
                  {selectedTab === REPAYMENTS && (
                    <MenuItem
                      onClick={() =>
                        dispatch(
                          openItemView({
                            itemType: 'transactions',
                            mode: 'view',
                            attrs: {
                              label: 'All Repayments',
                              transactions: repayments,
                            },
                          })
                        )
                      }
                    >
                      View All Repayments
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() =>
                      dispatch(push(`/reports/${type}/${selectedTab}`))
                    }
                  >
                    {startCase(selectedTab)} Page
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Box>
          </Grow>
        )}
      </Popper>
    </>
  );
}
