import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordian from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordianSummary from '@mui/material/AccordionSummary';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import NetworthSummaryStack from '../Dashboard/Networth/NetworthSummaryStack';
import { numberToCurrency } from '../../helpers/currency';

const TABS = ['assets', 'debts'];

export default function SelectedNetworth(props) {
  const { selectedId } = props;

  const networths = useSelector((state) => state.networths.data);
  const [networth, setNetworth] = useState(null);

  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);
  const [groupedItems, setGroupedItems] = useState([]);

  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (selectedId) {
      setNetworth(find(networths, { networth_id: selectedId }));
    } else {
      setNetworth(null);
    }
  }, [networths, selectedId]);

  useEffect(() => {
    if (networth) {
      setAssetSum(
        reduce(networth.assets, (sum, asset) => sum + asset.value, 0)
      );
      setDebtSum(reduce(networth.debts, (sum, debt) => sum + debt.value, 0));
    } else {
      setAssetSum(0);
      setDebtSum(0);
    }
  }, [networth]);

  useEffect(() => {
    if (networth) {
      let _items = networth[TABS[tab]];
      let _groupedItems = groupBy(_items, 'category');
      _groupedItems = Object.keys(_groupedItems).map((group) => {
        const groupItems = _groupedItems[group];
        const groupSum = reduce(groupItems, (sum, item) => sum + item.value, 0);
        return {
          group,
          items: groupItems,
          sum: groupSum,
        };
      });
      setGroupedItems(sortBy(_groupedItems, 'sum').reverse());
    } else {
      setGroupedItems([]);
    }
  }, [tab, networth]);

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Grid item xs={12}>
        <Card raised>
          <CardHeader
            title={dayjs(networth?.date).format('MMMM, YYYY')}
            sx={{ p: 1, pt: '4px', pb: 0 }}
            titleTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
          />
          <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
            <NetworthSummaryStack assetSum={assetSum} debtSum={debtSum} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card raised>
          <CardContent sx={{ p: 0, pb: '0 !important' }}>
            <Tabs value={tab} onChange={handleChangeTab} centered>
              {TABS.map((tab) => (
                <Tab key={tab} label={tab} />
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {groupedItems.map((group) => {
          return (
            <Accordian
              sx={{
                backgroundColor: (theme) => theme.palette.background.dark,
              }}
            >
              <AccordianSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    justifyContent: 'space-between',
                    mr: 2,
                  },
                }}
              >
                <span>{group.group}</span>
                <span>{numberToCurrency.format(group.sum)}</span>
              </AccordianSummary>
              <AccordionDetails>
                {
                  <List disablePadding>
                    {group.items.map((item) => {
                      return (
                        <ListItem disablePadding disableGutters ket={item.name}>
                          <ListItemText
                            primary={item.name}
                            primaryTypographyProps={{ variant: 'body2' }}
                            sx={{ m: 0, mr: 1, p: 0 }}
                          />
                          <ListItemText
                            sx={{ p: 0, m: 0 }}
                            primary={numberToCurrency.format(item.value)}
                            primaryTypographyProps={{
                              variant: 'body2',
                              align: 'right',
                              fontWeight: 800,
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                }
              </AccordionDetails>
            </Accordian>
          );
        })}
      </Grid>
    </>
  );
}
