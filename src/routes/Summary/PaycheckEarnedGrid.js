import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import sumBy from 'lodash/sumBy';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';
import LabelValueButton from '../../components/LabelValueButton';

export default function PaycheckEarnedGrid(props) {
  const { employer, paychecks } = props;
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);

  const openTransactionsDialog = (title, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: transactions,
        id: title,
      })
    );
  };

  const takeHomeSum = sumBy(paychecks, 'take_home');
  const taxesSum = sumBy(paychecks, 'taxes');
  const benefitsSum = sumBy(paychecks, 'benefits');
  const retirementSum = sumBy(paychecks, 'retirement');
  const otherSum = sumBy(paychecks, 'other');

  return (
    <>
      <LabelValueButton
        label={employer}
        value={takeHomeSum}
        onClick={() => setExpanded(!expanded)}
        Icon={expanded ? ExpandLessIcon : ExpandMoreIcon}
      />
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='center'
        mx={1}
        pt='0 !important'
      >
        <Collapse
          in={expanded}
          timeout='auto'
          unmountOnExit
          sx={{ width: '100%' }}
        >
          <Grid container spacing={1} mt={0}>
            {taxesSum > 0 && (
              <Grid item xs={12} mx={1}>
                <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                  <LabelValueBox
                    value={taxesSum}
                    label='taxes'
                    textSize='small'
                  />
                </Box>
              </Grid>
            )}
            {benefitsSum > 0 && (
              <Grid item xs={12} mx={1}>
                <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                  <LabelValueBox
                    value={benefitsSum}
                    label='benefits'
                    textSize='small'
                  />
                </Box>
              </Grid>
            )}
            {retirementSum > 0 && (
              <Grid item xs={12} mx={1}>
                <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                  <LabelValueBox
                    value={retirementSum}
                    label='retirement'
                    textSize='small'
                  />
                </Box>
              </Grid>
            )}
            {otherSum > 0 && (
              <Grid item xs={12} mx={1}>
                <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                  <LabelValueBox
                    value={otherSum}
                    label='other'
                    textSize='small'
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => openTransactionsDialog('paychecks', paychecks)}
              >
                show all
              </Button>
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
    </>
  );
}
