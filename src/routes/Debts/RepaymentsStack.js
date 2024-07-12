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

const RepaymentBox = (props) => {
  const { repayment } = props;
  const theme = useTheme();
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
          <BoxFlexCenter>
            <Typography variant='h6' color='grey.0'>
              $
            </Typography>
            <Typography variant='h6' color='grey.0' fontWeight='bold'>
              {_numberToCurrency.format(repayment.principal)}
            </Typography>
          </BoxFlexCenter>
          <Typography variant='body2' color='grey.0'>
            principal
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <BoxFlexCenter>
            <Typography variant='h6' color='grey.0'>
              $
            </Typography>
            <Typography variant='h6' color='grey.0' fontWeight='bold'>
              {_numberToCurrency.format(repayment.interest)}
            </Typography>
          </BoxFlexCenter>
          <Typography variant='body2' color='grey.0'>
            interest
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='grey.0'>
            {dayjs(repayment.date).format('MMM D, YYYY')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {_numberToCurrency.format(
                repayment.principal +
                  repayment.interest +
                  (repayment.escrow ? repayment.escrow : 0)
              )}
            </Typography>
          </BoxFlexCenter>
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
    let _repayments = filter(allRepayments, { debt_id: debtId });
    setRepayment(sortBy(_repayments, 'date').reverse());
  }, [allRepayments, debtId]);

  return map(repayments, (repayment) => {
    return <RepaymentBox key={repayment.repayment_id} repayment={repayment} />;
  });
}
