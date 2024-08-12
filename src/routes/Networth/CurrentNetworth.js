import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import { TABS } from './SelectedNetworth';
import NetworthContainer from './NetworthContainer';
import DataBox from './DataBox';
import ItemBox from './ItemBox';

export default function CurrentNetworth(props) {
  const { showItems = true, handleSelectPreviousMonth } = props;
  const today = dayjs();
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [tabIdx, setTabIdx] = useState(0);

  const [expanded, setExpanded] = useState('');
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
      {handleSelectPreviousMonth && (
        <Grid
          item
          xs={12}
          mx={2}
          sx={{ position: 'relative', top: 25, height: 0 }}
        >
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            mx={1}
          >
            <Card raised>
              <IconButton
                onClick={handleSelectPreviousMonth}
                sx={{ ml: '4px', pl: 1, pr: 0, mr: '4px' }}
              >
                <ArrowBackIosIcon />
              </IconButton>
            </Card>
            <Card raised>
              <IconButton disabled>
                <ArrowForwardIosIcon />
              </IconButton>
            </Card>
          </Stack>
        </Grid>
      )}

      <NetworthContainer
        assetSum={assetSum}
        debtSum={debtSum}
        year={today.year()}
        month={today.month() + 1}
        subtitle='current net worth'
        noTopPadding={!!handleSelectPreviousMonth}
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
            <Grid item key={group + idx} xs={12} mx={1} pt={'2px !important'}>
              <DataBox
                expanded={group.group === expanded}
                label={group.group}
                value={group.sum}
                setExpanded={setExpanded}
              />
              {expanded === group.group &&
                group.items.map((item) => {
                  const value = item?.value || item?.amount;
                  return (
                    <ItemBox
                      key={item.name + value}
                      tab={TABS[tabIdx]}
                      item={item}
                    />
                  );
                })}
            </Grid>
          );
        })}
    </>
  );
}
