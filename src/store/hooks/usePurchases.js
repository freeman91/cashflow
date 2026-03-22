import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import { findAmount } from '../../helpers/transactions';
import { getPurchases } from '../purchases';

export const usePurchases = (year, month) => {
  const dispatch = useDispatch();
  const allPurchases = useSelector((state) => state.purchases.data);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    if (!year) return;
    let _start = null;
    let _end = null;
    let date = dayjs().set('year', year);

    if (isNaN(month)) {
      _start = date.startOf('year');
      _end = date.endOf('year');
    } else {
      date = date.set('month', month);
      _start = date.startOf('month');
      _end = date.endOf('month');
    }

    setStart(_start);
    setEnd(_end);

    dispatch(getPurchases({ range: { start: _start, end: _end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let _purchases = filter(allPurchases, (purchase) => {
      if (!purchase.date) return false;
      const purchaseDate = dayjs(purchase.date);
      return purchaseDate.isAfter(start) && purchaseDate.isBefore(end);
    });
    setSum(
      reduce(
        _purchases,
        (acc, purchase) => {
          return acc + findAmount(purchase);
        },
        0
      )
    );
    setPurchases(_purchases);
  }, [start, end, allPurchases]);

  return { purchases, sum };
};

export default usePurchases;