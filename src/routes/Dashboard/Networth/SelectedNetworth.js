import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import SubAccountBreakdown from './SubAccountBreakdown';

const ASSETS = 'assets';

export default function SelectedNetworth(props) {
  const { selectedId, setSelectedId } = props;

  const networths = useSelector((state) => state.networths.data);
  const [networth, setNetworth] = useState(null);
  const [tab, setTab] = useState(ASSETS);

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
      let _items = networth[tab];
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

  const changeTab = (event, newValue) => {
    setTab(newValue);
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
    <SubAccountBreakdown
      tab={tab}
      changeTab={changeTab}
      groupedItems={groupedItems}
      handleSelectPreviousMonth={handleSelectPreviousMonth}
      handleSelectNextMonth={handleSelectNextMonth}
    />
  );
}
