import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
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

export default function CurrentNetworth(props) {
  const { showItems = true } = props;
  const today = dayjs();
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [tabIdx, setTabIdx] = useState(0);

  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);
  const [groupedItems, setGroupedItems] = useState([]);

  useEffect(() => {
    if (assets.length) {
      setAssetSum(reduce(assets, (sum, asset) => sum + asset.value, 0));
    } else {
      setAssetSum(0);
    }
    if (debts.length) {
      setDebtSum(reduce(debts, (sum, debt) => sum + debt.amount, 0));
    } else {
      setDebtSum(0);
    }
  }, [assets, debts]);

  useEffect(() => {
    let _items = tabIdx === 0 ? assets : debts;
    let _groupedItems = groupBy(_items, 'category');
    _groupedItems = Object.keys(_groupedItems).map((group) => {
      const groupItems = _groupedItems[group];
      const groupSum = reduce(
        groupItems,
        (sum, item) => sum + (item?.value || item.amount),
        0
      );
      return {
        group,
        items: groupItems,
        sum: groupSum,
      };
    });
    setGroupedItems(sortBy(_groupedItems, 'sum').reverse());
  }, [tabIdx, assets, debts]);

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <>
      <NetworthContainer
        assetSum={assetSum}
        debtSum={debtSum}
        year={today.year()}
        month={today.month() + 1}
      />

      {showItems && (
        <Grid item xs={12} mt={3}>
          <StyledTabs value={tabIdx} onChange={handleChange} centered>
            <StyledTab label='assets' sx={{ width: '35%' }} />
            <StyledTab label='debts' sx={{ width: '35%' }} />
          </StyledTabs>
        </Grid>
      )}

      {showItems &&
        groupedItems.map((group, idx) => {
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
                      const value = item?.value || item.amount;
                      return (
                        <ListItem
                          disablePadding
                          disableGutters
                          key={item.name + value}
                        >
                          <ListItemText
                            primary={item.name}
                            primaryTypographyProps={{ variant: 'body2' }}
                            sx={{ m: 0, mr: 1, p: 0 }}
                          />
                          <ListItemText
                            sx={{ p: 0, m: 0 }}
                            primary={numberToCurrency.format(value)}
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
