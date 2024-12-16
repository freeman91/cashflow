import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import sumBy from 'lodash/sumBy';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';

export default function PaycheckEarnedGrid(props) {
  const { employer, paychecks } = props;
  const dispatch = useDispatch();

  const [expandedSubcategories, setExpandedSubcategories] = useState(false);

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

  const hasDeductions =
    taxesSum > 0 || benefitsSum > 0 || retirementSum > 0 || otherSum > 0;

  return (
    <>
      <Grid key={employer} item xs={12} mx={1}>
        <Card
          sx={{
            width: '100%',
            p: 0.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              '&:hover': {
                backgroundColor: 'surface.250',
              },
              cursor: 'pointer',
              py: 0.5,
              px: 1,
              borderRadius: 1,
              flexGrow: 1,
            }}
            onClick={() => openTransactionsDialog(employer, paychecks)}
          >
            <LabelValueBox value={takeHomeSum} label={employer} />
          </Box>
          {hasDeductions && (
            <Box>
              <IconButton
                size='large'
                color='info'
                onClick={() => setExpandedSubcategories(!expandedSubcategories)}
                sx={{ p: 0.75, mr: 0.5 }}
              >
                {expandedSubcategories ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
          )}
        </Card>
      </Grid>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='center'
        mx={1}
        pt='0 !important'
      >
        <Collapse
          in={expandedSubcategories}
          timeout='auto'
          unmountOnExit
          sx={{ width: '100%' }}
        >
          <Grid container spacing={1} mt={0}>
            {taxesSum > 0 && (
              <Grid item xs={12} mx={1}>
                <Card sx={{ width: '100%', py: 0.5, px: 2 }}>
                  <LabelValueBox
                    value={taxesSum}
                    label='taxes'
                    textSize='small'
                  />
                </Card>
              </Grid>
            )}
            {benefitsSum > 0 && (
              <Grid item xs={12} mx={1}>
                <Card sx={{ width: '100%', py: 0.5, px: 2 }}>
                  <LabelValueBox
                    value={benefitsSum}
                    label='benefits'
                    textSize='small'
                  />
                </Card>
              </Grid>
            )}
            {retirementSum > 0 && (
              <Grid item xs={12} mx={1}>
                <Card sx={{ width: '100%', py: 0.5, px: 2 }}>
                  <LabelValueBox
                    value={retirementSum}
                    label='retirement'
                    textSize='small'
                  />
                </Card>
              </Grid>
            )}
            {otherSum > 0 && (
              <Grid item xs={12} mx={1}>
                <Card sx={{ width: '100%', py: 0.5, px: 2 }}>
                  <LabelValueBox
                    value={otherSum}
                    label='other'
                    textSize='small'
                  />
                </Card>
              </Grid>
            )}
          </Grid>
        </Collapse>
      </Grid>
    </>
  );
}
