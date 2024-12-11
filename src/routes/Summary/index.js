import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import MonthSummary from './Month';
import YearSummary from './Year';

export default function Summary() {
  const location = useLocation();

  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    const today = dayjs();
    const _year = location.pathname.split('/')[2];
    const _month = location.pathname.split('/')[3];

    if (!_year && !_month) {
      setYear(today.year());
      setMonth(today.month() + 1);
    } else {
      setYear(_year);
      setMonth(_month);
    }
  }, [location]);

  if (year && month) {
    return <MonthSummary year={year} month={month} />;
  } else if (year) {
    return <YearSummary year={year} />;
  } else {
    return <div>Loading...</div>;
  }
}
