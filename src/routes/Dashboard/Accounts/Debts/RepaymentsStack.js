import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../../../helpers/currency';
import { openDialog } from '../../../../store/dialogs';
import BoxFlexColumn from '../../../../components/BoxFlexColumn';
import BoxFlexCenter from '../../../../components/BoxFlexCenter';

const RepaymentBox = (props) => {
  const { repayment } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      openDialog({
        type: repayment._type,
        mode: 'edit',
        id: repayment.repayment_id,
        attrs: repayment,
      })
    );
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='left' variant='body2' color='text.secondary'>
            {dayjs(repayment.date).format('MMM D, YYYY')}{' '}
            {repayment.pending && '(pending)'}
          </Typography>
          <BoxFlexCenter justifyContent='flex-start'>
            <Typography variant='h5' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h5' fontWeight='bold'>
              {_numberToCurrency.format(
                repayment.principal +
                  repayment.interest +
                  (repayment.escrow ? repayment.escrow : 0)
              )}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <BoxFlexCenter>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              {_numberToCurrency.format(repayment.principal)}
            </Typography>
          </BoxFlexCenter>
          <Typography variant='body2' color='text.secondary'>
            principal
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <BoxFlexCenter>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              {_numberToCurrency.format(repayment.interest)}
            </Typography>
          </BoxFlexCenter>
          <Typography variant='body2' color='text.secondary'>
            interest
          </Typography>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function RepaymentsStack(props) {
  const { debtId } = props;

  const allRepayments = useSelector((state) => state.repayments.data);
  const [repayments, setRepayment] = useState([]);

  useEffect(() => {
    let _repayments = filter(allRepayments, {
      debt_id: debtId,
      pending: false,
    });
    setRepayment(sortBy(_repayments, 'date').reverse());
  }, [allRepayments, debtId]);

  return (
    <Card raised sx={{ maxWidth: 500, width: '100%' }}>
      <Stack spacing={1} direction='column' pt={1} pb={1}>
        {map(repayments, (repayment, idx) => {
          return (
            <React.Fragment key={repayment.repayment_id}>
              <RepaymentBox repayment={repayment} />
              {idx < repayments.length - 1 && (
                <Divider sx={{ mx: '8px !important' }} />
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </Card>
  );
}
