import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import { findAmount } from '../../helpers/transactions';
import { getSales } from '../sales';

export const useSales = (year, month) => {
  const dispatch = useDispatch();
  const allSales = useSelector((state) => state.sales.data);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [sales, setSales] = useState([]);
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

    dispatch(getSales({ range: { start: _start, end: _end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let _sales = filter(allSales, (sale) => {
      if (!sale.date) return false;
      const saleDate = dayjs(sale.date);
      return saleDate.isAfter(start) && saleDate.isBefore(end);
    });
    setSum(
      reduce(
        _sales,
        (acc, sale) => {
          return acc + findAmount(sale);
        },
        0
      )
    );
    setSales(_sales);
  }, [start, end, allSales]);

  return { sales, sum };
};

export default useSales;