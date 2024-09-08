import React, { useState } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { numberToCurrency } from '../../../helpers/currency';
import { StyledSubtab, StyledSubtabs } from '../../../components/StyledSubtabs';
import ItemBox from '../../../components/ItemBox';

const ASSETS = 'assets';
const DEBTS = 'debts';

export default function SubAccountBreakdown(props) {
  const {
    tab,
    handleChange,
    groupedItems,
    handleSelectPreviousMonth,
    handleSelectNextMonth = null,
  } = props;
  const [expanded, setExpanded] = useState('');
  return (
    <>
      <Grid
        item
        xs={12}
        mx={2}
        sx={{ position: 'relative', top: -140, height: 0 }}
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mx={1}
        >
          <IconButton
            onClick={handleSelectPreviousMonth}
            sx={{ ml: '4px', pl: 1, pr: 0, mr: '4px' }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            disabled={!handleSelectNextMonth}
            onClick={handleSelectNextMonth}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      </Grid>
      <Grid item xs={12} mx={1} pt='0 !important'>
        <StyledSubtabs
          value={tab}
          onChange={handleChange}
          variant='fullWidth'
          sx={{ pb: 1 }}
        >
          <StyledSubtab label={ASSETS} value={ASSETS} />
          <StyledSubtab label={DEBTS} value={DEBTS} />
        </StyledSubtabs>
      </Grid>
      <Grid item xs={12} mx={1} pt={'0px !important'}>
        <Card raised>
          <List disablePadding>
            {groupedItems.map((group, groupIdx) => {
              return (
                <React.Fragment key={group + groupIdx}>
                  <ListItemButton
                    onClick={() => setExpanded(expanded ? '' : group.group)}
                  >
                    <ListItemText secondary={group.group} />
                    <ListItemText
                      primary={numberToCurrency.format(group.sum)}
                      primaryTypographyProps={{
                        fontWeight: 'bold',
                        align: 'right',
                      }}
                      sx={{ mr: 2 }}
                    />
                    {expanded === group.group ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItemButton>
                  <Collapse
                    in={expanded === group.group}
                    timeout='auto'
                    unmountOnExit
                  >
                    <Divider />
                    {group.items.map((item, idx) => {
                      const value = item?.value || item?.amount;
                      return (
                        <React.Fragment key={item.name + value}>
                          <Box sx={{ m: 0.5 }}>
                            <ItemBox item={item} />
                          </Box>

                          {idx < group.items.length - 1 && (
                            <Divider sx={{ mx: '8px !important' }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                    <Divider />
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        </Card>
      </Grid>
    </>
  );
}
