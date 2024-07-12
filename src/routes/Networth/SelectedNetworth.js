import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordian from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordianSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';
import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import NetworthContainer from './NetworthContainer';

const TABS = ['assets', 'debts'];

export default function SelectedNetworth(props) {
  const { selectedId } = props;

  const networths = useSelector((state) => state.networths.data);
  const [networth, setNetworth] = useState(null);
  const [tabIdx, setTabIdx] = useState(0);

  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);
  const [groupedItems, setGroupedItems] = useState([]);

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
      let _items = networth[TABS[tabIdx]];
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
  }, [tabIdx, networth]);

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  if (!networth) return null;
  return (
    <>
      <NetworthContainer
        assetSum={assetSum}
        debtSum={debtSum}
        year={networth.year}
        month={networth.month}
      />

      <Grid item xs={12} mt={3}>
        <StyledTabs value={tabIdx} onChange={handleChange} centered>
          <StyledTab label='assets' sx={{ width: '35%' }} />
          <StyledTab label='debts' sx={{ width: '35%' }} />
        </StyledTabs>
      </Grid>

      {groupedItems.map((group, idx) => {
        return (
          <Accordian
            key={group.group}
            sx={{
              mt: idx === 0 ? '4px' : 'unset',
              width: '100%',
              bgcolor: 'surface.250',
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
                      <ListItem
                        disablePadding
                        disableGutters
                        key={item.name + item.value}
                      >
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
    </>
  );
}
