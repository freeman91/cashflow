import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import uniq from 'lodash/uniq';

export const useMerchants = () => {
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    let _expenses = [...allExpenses, ...allRepayments];
    let _merchants = uniq(_expenses.map((expense) => expense.merchant));
    setMerchants(_merchants);
  }, [allExpenses, allRepayments]);

  return merchants;
};

export default useMerchants;
