import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Grid from '@mui/material/Grid';

import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import NetworthContainer from './NetworthContainer';
import ItemBox from './ItemBox';
import DataBox from './DataBox';

export const TABS = ['assets', 'debts'];

export default function SelectedNetworth(props) {
  const { selectedId } = props;

  const networths = useSelector((state) => state.networths.data);
  const [networth, setNetworth] = useState(null);
  const [tabIdx, setTabIdx] = useState(0);

  const [expanded, setExpanded] = useState('');
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
          <Grid item key={group + idx} xs={12} mx={1} pt={'2px !important'}>
            <DataBox
              expanded={group.group === expanded}
              label={group.group}
              value={group.sum}
              setExpanded={setExpanded}
            />
            {expanded === group.group &&
              group.items.map((item) => {
                return (
                  <ItemBox
                    key={item.name + item.value}
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
