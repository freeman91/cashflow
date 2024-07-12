import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

const BorrowBox = (props) => {
  const { borrow } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      openDialog({
        type: borrow._type,
        mode: 'edit',
        id: borrow.borrow_id,
        attrs: borrow,
      })
    );
  };

  return (
    <Box
      onClick={handleClick}
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
        border: `2px solid ${theme.palette.surface[500]}`,
      }}
    >
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
            {borrow.lender}
          </Typography>
          <Typography variant='body2' color='grey.0'>
            lender
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='grey.0'>
            {dayjs(borrow.date).format('MMM D, YYYY')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {_numberToCurrency.format(borrow.amount)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function BorrowsStack(props) {
  const { debtId } = props;
  const allBorrows = useSelector((state) => state.borrows.data);
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    let _borrows = filter(allBorrows, { debt_id: debtId });
    setBorrows(sortBy(_borrows, 'date').reverse());
  }, [allBorrows, debtId]);

  return map(borrows, (borrow) => {
    return <BorrowBox key={borrow.borrow_id} borrow={borrow} />;
  });
}
