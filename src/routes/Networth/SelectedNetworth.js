import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import NetworthContainer from './NetworthContainer';
import ItemBox from './ItemBox';
import DataBox from './DataBox';

export const TABS = ['assets', 'debts'];

export default function SelectedNetworth(props) {
  const { selectedId, setSelectedId } = props;

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

  const handleSelectPreviousMonth = () => {
    const nextNetworthDate = dayjs()
      .year(networth.year)
      .month(networth.month - 1)
      .subtract(1, 'month');

    const nextNetworth = find(networths, {
      year: nextNetworthDate.year(),
      month: nextNetworthDate.month() + 1,
    });
    if (nextNetworth) {
      setSelectedId(nextNetworth.networth_id);
    }
  };

  const handleSelectNextMonth = () => {
    const nextNetworthDate = dayjs()
      .year(networth.year)
      .month(networth.month - 1)
      .add(1, 'month');

    const nextNetworth = find(networths, {
      year: nextNetworthDate.year(),
      month: nextNetworthDate.month() + 1,
    });
    if (nextNetworth) {
      setSelectedId(nextNetworth.networth_id);
    } else {
      setSelectedId(null);
    }
  };

  if (!networth) return null;
  return (
    <>
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
            <IconButton onClick={handleSelectNextMonth}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Card>
        </Stack>
      </Grid>
      <NetworthContainer
        assetSum={assetSum}
        debtSum={debtSum}
        year={networth.year}
        month={networth.month}
        noTopPadding
      />
      <Grid item xs={12} mt={3}>
        <StyledTabs value={tabIdx} onChange={handleChange} centered>
          <StyledTab label='assets' sx={{ width: '35%' }} />
          <StyledTab label='debts' sx={{ width: '35%' }} />
        </StyledTabs>
      </Grid>
      {/* {groupedItems.map((group, idx) => {
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
      })} */}
      <Card raised sx={{ width: '100%', borderRadius: 'unset', mt: '2px' }}>
        <Stack
          spacing={'4px'}
          direction='column'
          justifyContent='center'
          alignItems='center'
          px={2}
        >
          {groupedItems.map((group, idx) => {
            return (
              <React.Fragment key={group + idx}>
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
                {idx < groupedItems.length - 1 && (
                  <Divider sx={{ mx: '8px !important', width: '100%' }} />
                )}
              </React.Fragment>
            );
          })}
        </Stack>
      </Card>
    </>
  );
}
