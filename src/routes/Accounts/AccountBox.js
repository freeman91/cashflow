import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import LaunchIcon from '@mui/icons-material/Launch';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function AccountBox(props) {
  const { account } = props;
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleClick = (account) => {
    dispatch(push('/accounts/' + account.account_id));
  };

  const handleLinkClick = (e, account) => {
    e.stopPropagation();
    window.open(account?.url, '_blank');
  };

  return (
    <Box
      key={account.account_id}
      onClick={() => handleClick(account)}
      sx={{
        position: 'relative',
        background: `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[250]})`,
        zIndex: 1,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        p: '4px',
        mt: 1,
        pr: 2,
        border: `2px solid ${theme.palette.surface[600]}`,
      }}
    >
      <IconButton
        color='primary'
        onClick={(e) => handleLinkClick(e, account)}
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
          boxShadow: 6,
          borderRadius: '50%',
          p: '4px',
        }}
      >
        <LaunchIcon />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 2,
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='h6'
            color='grey.0'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {account.name}
          </Typography>
          <Typography variant='body2' color='grey.0'>
            {account.category}
          </Typography>
        </BoxFlexColumn>
        <BoxFlexCenter>
          <Typography variant='h5' color='grey.10'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(account.net)}
          </Typography>
        </BoxFlexCenter>
      </Box>
    </Box>
  );
}
