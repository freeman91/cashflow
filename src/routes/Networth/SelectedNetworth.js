import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import SubAccountBreakdown from './SubAccountBreakdown';

export default function SelectedNetworth(props) {
  const { networthId, tab } = props;

  const networths = useSelector((state) => state.networths.data);
  const [networth, setNetworth] = useState(null);

  const [groupedItems, setGroupedItems] = useState([]);

  useEffect(() => {
    if (networthId) {
      setNetworth(find(networths, { networth_id: networthId }));
    } else {
      setNetworth(null);
    }
  }, [networths, networthId]);

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

  if (!networth) return null;
  return <SubAccountBreakdown groupedItems={groupedItems} />;
}
