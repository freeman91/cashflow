import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import SubAccountBreakdown from './SubAccountBreakdown';

const ASSETS = 'assets';

export default function CurrentNetworth(props) {
  const { handleSelectPreviousMonth } = props;

  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [tab, setTab] = useState(ASSETS);
  const [groupedItems, setGroupedItems] = useState([]);

  useEffect(() => {
    let _items = tab === ASSETS ? assets : debts;
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
  }, [tab, assets, debts]);

  const changeTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <SubAccountBreakdown
      tab={tab}
      changeTab={changeTab}
      groupedItems={groupedItems}
      handleSelectPreviousMonth={handleSelectPreviousMonth}
    />
  );
}
