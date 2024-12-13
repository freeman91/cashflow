import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import ItemBox from '../../components/ItemBox';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function SubAccountBreakdown(props) {
  const { groupedItems } = props;
  const [expanded, setExpanded] = useState('');
  return (
    <>
      {groupedItems.map((group, groupIdx) => {
        const items = group.items.sort((a, b) => {
          const aValue = a?.value || a?.amount;
          const bValue = b?.value || b?.amount;
          return bValue - aValue;
        });
        return (
          <Grid
            key={group + groupIdx}
            item
            xs={12}
            mx={1}
            display='flex'
            justifyContent='center'
          >
            <Card sx={{ width: '100%' }}>
              <List sx={{ p: 1 }}>
                <ListItemButton
                  onClick={() => setExpanded(expanded ? '' : group.group)}
                  sx={{ py: 0, px: 1 }}
                >
                  <ListItemText primary={group.group} />
                  {(items.length > 1 || expanded !== group.group) && (
                    <BoxFlexCenter>
                      <Typography variant='body1' color='text.secondary'>
                        $
                      </Typography>
                      <Typography variant='h6' color='white' fontWeight='bold'>
                        {_numberToCurrency.format(group.sum)}
                      </Typography>
                    </BoxFlexCenter>
                  )}
                </ListItemButton>
                <Collapse
                  in={expanded === group.group}
                  timeout='auto'
                  unmountOnExit
                >
                  <Divider sx={{ mx: '4px !important' }} />
                  {items.map((item, idx) => {
                    const value = item?.value || item?.amount;
                    return (
                      <React.Fragment key={item.name + value}>
                        <Box sx={{ m: 1 }}>
                          <ItemBox item={item} edit={false} />
                        </Box>

                        {idx < items.length - 1 && (
                          <Divider sx={{ mx: '8px !important' }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Collapse>
              </List>
            </Card>
          </Grid>
        );
      })}
    </>
  );
}
